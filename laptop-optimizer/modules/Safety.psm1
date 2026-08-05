<#
    Safety.psm1 - the safety net.

    Two independent layers:
      1. A Windows System Restore point, created before the first change.
      2. A JSON undo log recording every individual change, replayable later.

    Layer 2 is the one that matters day to day: it reverses exactly what this
    tool did, without rolling back anything else you have done since.
#>

Set-StrictMode -Version 2.0

function New-SafetyCheckpoint {
    <#  Creates a System Restore point. Returns $true if one now exists for this run.  #>
    param([string]$Description = 'Laptop Optimizer - before optimization')

    $ctx = Get-OptContext

    if ($ctx.DryRun) {
        Write-OptLog 'WOULD: create a System Restore point' 'Info'
        return $true
    }

    try {
        # System Restore is off by default on some OEM images.
        Enable-ComputerRestore -Drive "$env:SystemDrive\" -ErrorAction Stop
    } catch {
        Write-OptLog "Could not enable System Restore: $($_.Exception.Message)" 'Warn'
    }

    # Windows normally refuses more than one restore point per 24 hours.
    $freqKey = 'HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\SystemRestore'
    $oldFreq = $null
    try {
        if (Test-Path $freqKey) {
            $oldFreq = (Get-ItemProperty -Path $freqKey -Name 'SystemRestorePointCreationFrequency' -ErrorAction SilentlyContinue).SystemRestorePointCreationFrequency
        } else {
            New-Item -Path $freqKey -Force | Out-Null
        }
        Set-ItemProperty -Path $freqKey -Name 'SystemRestorePointCreationFrequency' -Value 0 -Type DWord -ErrorAction Stop
    } catch {
        Write-OptLog 'Could not relax the restore point rate limit; Windows may skip the checkpoint.' 'Warn'
    }

    $created = $false
    try {
        Checkpoint-Computer -Description $Description -RestorePointType 'MODIFY_SETTINGS' -ErrorAction Stop
        Write-OptLog 'System Restore point created.' 'Change'
        $created = $true
    } catch {
        Write-OptLog "System Restore point failed: $($_.Exception.Message). The undo file is still active." 'Warn'
    }

    # Put the rate limit back the way we found it.
    try {
        if ($null -ne $oldFreq) {
            Set-ItemProperty -Path $freqKey -Name 'SystemRestorePointCreationFrequency' -Value $oldFreq -Type DWord -ErrorAction SilentlyContinue
        } else {
            Remove-ItemProperty -Path $freqKey -Name 'SystemRestorePointCreationFrequency' -ErrorAction SilentlyContinue
        }
    } catch { }

    return $created
}

function Get-UndoLogs {
    <#  Newest first. Each entry is a saved run that can be reversed.  #>
    $ctx = Get-OptContext
    $files = @(Get-ChildItem -Path $ctx.DataDir -Filter 'undo-*.json' -ErrorAction SilentlyContinue |
        Sort-Object LastWriteTime -Descending)

    $results = @()
    foreach ($f in $files) {
        try {
            $data = Get-Content -Path $f.FullName -Raw -Encoding UTF8 | ConvertFrom-Json
            $results += [pscustomobject]@{
                Path        = $f.FullName
                RunId       = $data.RunId
                Created     = $data.Created
                RecordCount = @($data.Records).Count
                Records     = @($data.Records)
            }
        } catch {
            Write-OptLog "Skipping unreadable undo file $($f.Name)" 'Warn'
        }
    }
    return $results
}

function Invoke-UndoLog {
    <#
        Replays one saved run in reverse order. Each record type has a handler.
        Anything that cannot be reversed (an uninstall) is reported, not silently
        skipped.
    #>
    param([Parameter(Mandatory)][string]$Path)

    if (-not (Test-Path $Path)) {
        Write-OptLog "Undo file not found: $Path" 'Error'
        return
    }

    try {
        $data = Get-Content -Path $Path -Raw -Encoding UTF8 | ConvertFrom-Json
    } catch {
        Write-OptLog "Undo file is corrupt: $($_.Exception.Message)" 'Error'
        return
    }

    $records = @($data.Records)
    [array]::Reverse($records)

    $undone = 0
    $failed = 0
    $manual = 0

    foreach ($r in $records) {
        try {
            switch ($r.Type) {

                'Service' {
                    $name = $r.Data.Name
                    $old  = $r.Data.OldStartType
                    Set-ServiceStartType -Name $name -StartType $old
                    Write-OptLog "Restored service '$name' to $old." 'Change'
                    $undone++
                }

                'StartupApproved' {
                    Set-StartupApprovedState -HivePath $r.Data.KeyPath -ValueName $r.Data.ValueName -Enabled $true
                    Write-OptLog "Re-enabled startup item '$($r.Data.ValueName)'." 'Change'
                    $undone++
                }

                'ScheduledTask' {
                    Enable-ScheduledTask -TaskName $r.Data.TaskName -TaskPath $r.Data.TaskPath -ErrorAction Stop | Out-Null
                    Write-OptLog "Re-enabled scheduled task '$($r.Data.TaskName)'." 'Change'
                    $undone++
                }

                'StartupShortcut' {
                    $disabled = $r.Data.DisabledPath
                    $original = $r.Data.OriginalPath
                    if (Test-Path $disabled) {
                        Move-Item -Path $disabled -Destination $original -Force -ErrorAction Stop
                        Write-OptLog "Restored startup shortcut '$(Split-Path $original -Leaf)'." 'Change'
                        $undone++
                    }
                }

                'PowerScheme' {
                    & powercfg.exe /setactive $r.Data.OldSchemeGuid 2>&1 | Out-Null
                    Write-OptLog 'Restored the previous power plan.' 'Change'
                    $undone++
                }

                'PowerValue' {
                    & powercfg.exe /setacvalueindex $r.Data.Scheme $r.Data.SubGroup $r.Data.Setting $r.Data.OldAcValue 2>&1 | Out-Null
                    & powercfg.exe /setdcvalueindex $r.Data.Scheme $r.Data.SubGroup $r.Data.Setting $r.Data.OldDcValue 2>&1 | Out-Null
                    & powercfg.exe /setactive $r.Data.Scheme 2>&1 | Out-Null
                    $undone++
                }

                'Registry' {
                    $keyPath = $r.Data.KeyPath
                    $valName = $r.Data.ValueName
                    if ($null -eq $r.Data.OldValue -or "$($r.Data.OldValue)" -eq '') {
                        Remove-ItemProperty -Path $keyPath -Name $valName -ErrorAction SilentlyContinue
                    } else {
                        Set-ItemProperty -Path $keyPath -Name $valName -Value $r.Data.OldValue -ErrorAction Stop
                    }
                    Write-OptLog "Restored registry value '$valName'." 'Change'
                    $undone++
                }

                'AppRemoved' {
                    Write-OptLog "Cannot auto-restore '$($r.Data.Name)' - reinstall it from the Microsoft Store or HP if you want it back." 'Warn'
                    $manual++
                }

                'FileDeleted' {
                    Write-OptLog "Deleted files are not recoverable from the undo log: $($r.Data.Path)" 'Warn'
                    $manual++
                }

                default {
                    Write-OptLog "Unknown undo record type '$($r.Type)' - skipped." 'Warn'
                }
            }
        } catch {
            $failed++
            Write-OptLog "Undo failed for $($r.Type) / $($r.Description): $($_.Exception.Message)" 'Error'
        }
    }

    Write-OptLog "Undo complete: $undone reversed, $failed failed, $manual need manual action." 'Info'

    if ($undone -gt 0) {
        # The file has served its purpose; keep it but mark it so it is not replayed twice.
        try {
            Rename-Item -Path $Path -NewName ((Split-Path $Path -Leaf) -replace '\.json$', '.applied.json') -ErrorAction Stop
        } catch { }
    }
}

Export-ModuleMember -Function New-SafetyCheckpoint, Get-UndoLogs, Invoke-UndoLog
