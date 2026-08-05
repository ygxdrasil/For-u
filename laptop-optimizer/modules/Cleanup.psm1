<#
    Cleanup.psm1 - disk cleanup. Off by default.

    The laptop is new, so there is nothing here worth reclaiming yet. In a year
    there will be. The module scans and reports first; deletion only happens if
    it is explicitly switched on, and deleted files are not recoverable from the
    undo log - which is why this is the one module that stays off unless asked.

    Prefetch is deliberately not touched: it makes boot faster, and deleting it
    is folklore, not optimisation.
#>

Set-StrictMode -Version 2.0

function Get-CleanupTargets {
    $targets = @(
        @{ Label = 'User temp files'
           Path  = $env:TEMP
           Why   = 'Scratch files left behind by installers and applications.' },

        @{ Label = 'Windows temp files'
           Path  = (Join-Path $env:SystemRoot 'Temp')
           Why   = 'System scratch space.' },

        @{ Label = 'Windows Update download cache'
           Path  = (Join-Path $env:SystemRoot 'SoftwareDistribution\Download')
           Why   = 'Installer payloads for updates that are already applied. Windows redownloads anything it still needs.' },

        @{ Label = 'Delivery Optimization cache'
           Path  = (Join-Path $env:SystemRoot 'ServiceProfiles\NetworkService\AppData\Local\Microsoft\Windows\DeliveryOptimization\Cache')
           Why   = 'Update chunks cached for sharing with other PCs on the network.' },

        @{ Label = 'Crash dumps'
           Path  = (Join-Path $env:LOCALAPPDATA 'CrashDumps')
           Why   = 'Memory dumps from crashed applications. Only useful while debugging that crash.' },

        @{ Label = 'Windows error reports'
           Path  = (Join-Path $env:PROGRAMDATA 'Microsoft\Windows\WER\ReportQueue')
           Why   = 'Queued error reports.' },

        @{ Label = 'Component servicing logs'
           Path  = (Join-Path $env:SystemRoot 'Logs\CBS')
           Why   = 'Windows servicing logs. Can grow to gigabytes on an older install.' },

        @{ Label = 'Thumbnail cache'
           Path  = (Join-Path $env:LOCALAPPDATA 'Microsoft\Windows\Explorer')
           Filter = 'thumbcache_*.db'
           Why   = 'Explorer thumbnail cache. Rebuilds itself as you browse folders.' }
    )

    $results = @()
    foreach ($t in $targets) {
        $path = $t.Path
        if (-not $path -or -not (Test-Path $path)) { continue }

        $filter = if ($t.ContainsKey('Filter')) { $t.Filter } else { '*' }

        $bytes = 0
        $count = 0
        try {
            $files = Get-ChildItem -Path $path -Filter $filter -Recurse -File -Force -ErrorAction SilentlyContinue
            foreach ($f in $files) {
                $bytes += $f.Length
                $count++
            }
        } catch { }

        $results += [pscustomobject]@{
            Label  = $t.Label
            Path   = $path
            Filter = $filter
            Bytes  = $bytes
            Files  = $count
            Why    = $t.Why
        }
    }

    return @($results)
}

function Get-LargeFiles {
    <#
        Report only. Never deletes - this exists so you can see what is actually
        using the 512 GB, and decide for yourself.
    #>
    param([int]$Top = 20, [int]$MinimumMB = 200)

    $roots = @(
        [Environment]::GetFolderPath('UserProfile')
    )

    $found = @()
    foreach ($root in $roots) {
        if (-not (Test-Path $root)) { continue }
        try {
            $found += Get-ChildItem -Path $root -Recurse -File -Force -ErrorAction SilentlyContinue |
                Where-Object { $_.Length -ge ($MinimumMB * 1MB) }
        } catch { }
    }

    return @($found |
        Sort-Object Length -Descending |
        Select-Object -First $Top |
        ForEach-Object {
            [pscustomobject]@{
                Name   = $_.Name
                Path   = $_.FullName
                SizeMB = [math]::Round($_.Length / 1MB, 0)
                Age    = [math]::Round(((Get-Date) - $_.LastWriteTime).TotalDays, 0)
            }
        })
}

function Invoke-Cleanup {
    <#  Deletes only when -Confirmed is passed. The UI keeps this off by default.  #>
    param([switch]$Confirmed)

    $ctx = Get-OptContext
    $targets = Get-CleanupTargets
    $total = ($targets | Measure-Object Bytes -Sum).Sum
    if (-not $total) { $total = 0 }

    Write-OptLog "Cleanup scan: $(Format-Bytes $total) across $($targets.Count) locations." 'Finding'
    foreach ($t in $targets | Sort-Object Bytes -Descending) {
        if ($t.Bytes -le 0) { continue }
        Write-OptLog "  $($t.Label): $(Format-Bytes $t.Bytes) - $($t.Why)" 'Finding'
    }

    if (-not $Confirmed) {
        Write-OptLog 'Cleanup is switched off, so nothing was deleted. Turn it on in Settings when the drive starts filling up.' 'Info'
        return 0
    }

    $freed = 0
    foreach ($t in $targets) {
        if ($t.Bytes -le 0) { continue }

        $path = $t.Path
        $filter = $t.Filter
        $bytes = $t.Bytes

        $action = {
            Get-ChildItem -Path $path -Filter $filter -Recurse -File -Force -ErrorAction SilentlyContinue |
                Remove-Item -Force -ErrorAction SilentlyContinue
        }.GetNewClosure()

        if (Invoke-Guarded `
                -Description "Cleared $($t.Label) - $(Format-Bytes $bytes)" `
                -UndoType 'FileDeleted' `
                -UndoData @{ Path = $path; Label = $t.Label } `
                -Action $action) {
            $freed += $bytes
        }
    }

    # Recycle Bin is separate - it has its own API and its own consequences.
    if ($Confirmed) {
        $action = { Clear-RecycleBin -Force -ErrorAction Stop }.GetNewClosure()
        Invoke-Guarded `
            -Description 'Emptied the Recycle Bin' `
            -UndoType 'FileDeleted' `
            -UndoData @{ Path = 'Recycle Bin' } `
            -Action $action | Out-Null
    }

    $ctx.Stats.BytesFreed += $freed
    return $freed
}

Export-ModuleMember -Function Get-CleanupTargets, Get-LargeFiles, Invoke-Cleanup
