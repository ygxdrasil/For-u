<#
    Storage.psm1 - SSD health readout and TRIM.

    Optimize-Volume on an SSD issues TRIM (ReTrim); it does not defragment and
    does not shorten the drive's life. On the off chance the system drive is a
    spinning disk, we defragment instead - running ReTrim on an HDD does nothing
    and running a defrag on an SSD is actively harmful, so the media type
    decides.
#>

Set-StrictMode -Version 2.0

function Get-SystemDriveLetter {
    return $env:SystemDrive.TrimEnd(':')
}

function Get-DriveHealthReport {
    $letter = Get-SystemDriveLetter
    $report = [pscustomobject]@{
        DriveLetter   = $letter
        MediaType     = 'Unknown'
        Model         = 'Unknown'
        HealthStatus  = 'Unknown'
        SizeGB        = 0
        FreeGB        = 0
        FreePercent   = 0
        WearPercent   = $null
        TempCelsius   = $null
        PowerOnHours  = $null
        ReadErrors    = $null
        WriteErrors   = $null
        TrimSupported = $null
    }

    try {
        $vol = Get-Volume -DriveLetter $letter -ErrorAction Stop
        $report.SizeGB = [math]::Round($vol.Size / 1GB, 1)
        $report.FreeGB = [math]::Round($vol.SizeRemaining / 1GB, 1)
        if ($vol.Size -gt 0) {
            $report.FreePercent = [math]::Round(($vol.SizeRemaining / $vol.Size) * 100, 1)
        }
    } catch { }

    try {
        $part = Get-Partition -DriveLetter $letter -ErrorAction Stop
        $disk = Get-Disk -Number $part.DiskNumber -ErrorAction Stop
        $phys = Get-PhysicalDisk -ErrorAction Stop | Where-Object { $_.DeviceId -eq "$($disk.Number)" } | Select-Object -First 1

        if ($phys) {
            $report.MediaType    = "$($phys.MediaType)"
            $report.Model        = "$($phys.FriendlyName)"
            $report.HealthStatus = "$($phys.HealthStatus)"

            $rc = $phys | Get-StorageReliabilityCounter -ErrorAction SilentlyContinue
            if ($rc) {
                if ($null -ne $rc.Wear)              { $report.WearPercent  = $rc.Wear }
                if ($null -ne $rc.Temperature)       { $report.TempCelsius  = $rc.Temperature }
                if ($null -ne $rc.PowerOnHours)      { $report.PowerOnHours = $rc.PowerOnHours }
                if ($null -ne $rc.ReadErrorsTotal)   { $report.ReadErrors   = $rc.ReadErrorsTotal }
                if ($null -ne $rc.WriteErrorsTotal)  { $report.WriteErrors  = $rc.WriteErrorsTotal }
            }
        }
    } catch { }

    try {
        # DisableDeleteNotify 0 means TRIM is enabled.
        $out = (& fsutil.exe behavior query DisableDeleteNotify 2>&1) -join ' '
        if ($out -match 'DisableDeleteNotify\s*=\s*0' -or $out -match 'NTFS\s*DisableDeleteNotify\s*=\s*0') {
            $report.TrimSupported = $true
        } elseif ($out -match 'DisableDeleteNotify\s*=\s*1') {
            $report.TrimSupported = $false
        }
    } catch { }

    return $report
}

function Invoke-StorageOptimization {
    $ctx = Get-OptContext
    Write-OptLog 'Checking the drive...' 'Info'

    $report = Get-DriveHealthReport
    $isSsd = $report.MediaType -match 'SSD'

    Write-OptLog "$($report.Model) - $($report.MediaType), $($report.FreeGB) GB free of $($report.SizeGB) GB ($($report.FreePercent)%)." 'Finding'
    Write-OptLog "Drive health: $($report.HealthStatus)." 'Finding'

    if ($null -ne $report.WearPercent) {
        $left = 100 - $report.WearPercent
        Write-OptLog "Drive wear: $($report.WearPercent)% used, roughly $left% of its rated write endurance remaining." 'Finding'
    }
    if ($null -ne $report.PowerOnHours) {
        Write-OptLog "Powered on for $($report.PowerOnHours) hours total." 'Finding'
    }
    if ($null -ne $report.TempCelsius) {
        Write-OptLog "Drive temperature: $($report.TempCelsius) degrees C." 'Finding'
    }
    if ($report.TrimSupported -eq $false) {
        Write-OptLog 'TRIM is switched off at the filesystem level. That will slow an SSD down over time.' 'Warn'
    }

    if ($report.HealthStatus -and $report.HealthStatus -notin @('Healthy', 'Unknown')) {
        Write-OptLog "The drive reports health '$($report.HealthStatus)'. Back up your data - no software tuning fixes failing storage." 'Warn'
    }

    $letter = $report.DriveLetter

    if ($isSsd) {
        $action = { Optimize-Volume -DriveLetter $letter -ReTrim -ErrorAction Stop | Out-Null }.GetNewClosure()
        Invoke-Guarded `
            -Description 'Ran TRIM on the SSD, telling it which blocks are free so writes stay fast' `
            -Action $action | Out-Null
    } elseif ($report.MediaType -match 'HDD') {
        $action = { Optimize-Volume -DriveLetter $letter -Defrag -ErrorAction Stop | Out-Null }.GetNewClosure()
        Invoke-Guarded `
            -Description 'Defragmented the hard drive' `
            -Action $action | Out-Null
    } else {
        # Unknown media type: -Analyze is read-only and safe either way.
        Write-OptLog "Media type reported as '$($report.MediaType)'. Skipping TRIM and defrag rather than guessing - the wrong one is harmful." 'Warn'
    }

    return $report
}

Export-ModuleMember -Function Get-DriveHealthReport, Invoke-StorageOptimization, Get-SystemDriveLetter
