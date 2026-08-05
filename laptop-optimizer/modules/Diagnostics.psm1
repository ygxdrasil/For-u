<#
    Diagnostics.psm1 - measure the machine, then name what is actually wrong.

    Two separate jobs:
      Get-Benchmark   objective numbers, recorded so before/after is real
      Get-Findings    the culprit hunt - what is making THIS machine slow

    Nothing here changes the system.
#>

Set-StrictMode -Version 2.0

function Get-SystemProfile {
    # Deliberately not named $profile - that is a PowerShell automatic variable.
    $info = [ordered]@{
        ComputerName = $env:COMPUTERNAME
        Manufacturer = 'unknown'
        Model        = 'unknown'
        Cpu          = 'unknown'
        CpuCores     = 0
        RamTotalGB   = 0
        OsName       = 'unknown'
        OsBuild      = 'unknown'
        UptimeHours  = 0
    }

    try {
        $cs = Get-CimInstance Win32_ComputerSystem -ErrorAction Stop
        $info.Manufacturer = $cs.Manufacturer
        $info.Model        = $cs.Model
        $info.RamTotalGB   = [math]::Round($cs.TotalPhysicalMemory / 1GB, 1)
    } catch { }

    try {
        $cpu = Get-CimInstance Win32_Processor -ErrorAction Stop | Select-Object -First 1
        $info.Cpu      = $cpu.Name.Trim()
        $info.CpuCores = $cpu.NumberOfCores
    } catch { }

    try {
        $os = Get-CimInstance Win32_OperatingSystem -ErrorAction Stop
        $info.OsName      = $os.Caption
        $info.OsBuild     = $os.BuildNumber
        $info.UptimeHours = [math]::Round(((Get-Date) - $os.LastBootUpTime).TotalHours, 1)
    } catch { }

    return [pscustomobject]$info
}

function Get-BootTimeMs {
    <#
        Windows records real boot duration in the Diagnostics-Performance log.
        Returns the average of the last few boots, or $null if the log is empty
        (common on a machine that has only booted a handful of times).
    #>
    try {
        $events = Get-WinEvent -FilterHashtable @{
            LogName = 'Microsoft-Windows-Diagnostics-Performance/Operational'
            Id      = 100
        } -MaxEvents 5 -ErrorAction Stop

        $times = @()
        foreach ($e in $events) {
            $xml = [xml]$e.ToXml()
            $node = $xml.Event.EventData.Data | Where-Object { $_.Name -eq 'BootTime' }
            if ($node) { $times += [double]$node.'#text' }
        }
        if ($times.Count -eq 0) { return $null }
        return [math]::Round(($times | Measure-Object -Average).Average, 0)
    } catch {
        return $null
    }
}

function Get-SlowBootContributors {
    <#
        Event 101 = an app delayed boot. 102 = a driver. 103 = a service.
        This is Windows' own measurement, not a guess.
    #>
    $results = @()
    try {
        $events = Get-WinEvent -FilterHashtable @{
            LogName = 'Microsoft-Windows-Diagnostics-Performance/Operational'
            Id      = 101, 102, 103
        } -MaxEvents 60 -ErrorAction Stop

        foreach ($e in $events) {
            $xml = [xml]$e.ToXml()
            $data = @{}
            foreach ($d in $xml.Event.EventData.Data) { $data[$d.Name] = $d.'#text' }

            $name = $data['FriendlyName']
            if (-not $name) { $name = $data['Name'] }
            if (-not $name) { continue }

            $ms = 0
            if ($data['TotalTime']) { $ms = [double]$data['TotalTime'] }

            $kind = switch ($e.Id) { 101 { 'App' } 102 { 'Driver' } 103 { 'Service' } default { 'Other' } }

            $results += [pscustomobject]@{ Name = $name; DelayMs = $ms; Kind = $kind }
        }
    } catch {
        return @()
    }

    # One row per offender, worst first.
    return @($results | Group-Object Name | ForEach-Object {
        [pscustomobject]@{
            Name    = $_.Name
            Kind    = $_.Group[0].Kind
            DelayMs = [math]::Round((($_.Group | Measure-Object DelayMs -Average).Average), 0)
            Count   = $_.Count
        }
    } | Sort-Object DelayMs -Descending | Select-Object -First 10)
}

function Get-MemorySnapshot {
    try {
        $os = Get-CimInstance Win32_OperatingSystem -ErrorAction Stop
        $totalKb = [double]$os.TotalVisibleMemorySize
        $freeKb  = [double]$os.FreePhysicalMemory
        $usedPct = if ($totalKb -gt 0) { [math]::Round((($totalKb - $freeKb) / $totalKb) * 100, 1) } else { 0 }
        return [pscustomobject]@{
            TotalGB     = [math]::Round($totalKb / 1MB, 1)
            FreeGB      = [math]::Round($freeKb / 1MB, 1)
            UsedPercent = $usedPct
        }
    } catch {
        return [pscustomobject]@{ TotalGB = 0; FreeGB = 0; UsedPercent = 0 }
    }
}

function Get-DiskWriteSpeed {
    <#
        Times a 256 MB sequential write with WriteThrough so the OS cache cannot
        flatter the result. Reported as write speed only - a cached read test
        would measure RAM, not the drive, so we do not pretend to offer one.
    #>
    param([int]$SizeMB = 256)

    $path = Join-Path $env:TEMP ('optimizer-disktest-{0}.tmp' -f ([guid]::NewGuid().ToString('N')))
    $chunk = New-Object byte[] (4MB)
    (New-Object System.Random).NextBytes($chunk)

    $fs = $null
    try {
        $fs = New-Object System.IO.FileStream(
            $path,
            [System.IO.FileMode]::Create,
            [System.IO.FileAccess]::Write,
            [System.IO.FileShare]::None,
            1MB,
            [System.IO.FileOptions]::WriteThrough)

        $sw = [System.Diagnostics.Stopwatch]::StartNew()
        for ($i = 0; $i -lt ($SizeMB / 4); $i++) {
            $fs.Write($chunk, 0, $chunk.Length)
        }
        $fs.Flush($true)
        $sw.Stop()

        $seconds = $sw.Elapsed.TotalSeconds
        if ($seconds -le 0) { return $null }
        return [math]::Round($SizeMB / $seconds, 0)
    } catch {
        return $null
    } finally {
        if ($fs) { try { $fs.Dispose() } catch { } }
        if (Test-Path $path) { Remove-Item $path -Force -ErrorAction SilentlyContinue }
    }
}

function Get-CpuHogs {
    <#
        Get-Process reports lifetime CPU, not a rate, so we sample twice and
        divide by the interval. Cheap and accurate enough to name a culprit.
    #>
    param([int]$SampleMs = 1000)

    try {
        $first = @{}
        foreach ($p in Get-Process -ErrorAction SilentlyContinue) {
            try { $first[$p.Id] = $p.TotalProcessorTime.TotalMilliseconds } catch { }
        }

        Start-Sleep -Milliseconds $SampleMs

        $cores = [Environment]::ProcessorCount
        $rows = @()
        foreach ($p in Get-Process -ErrorAction SilentlyContinue) {
            if (-not $first.ContainsKey($p.Id)) { continue }
            try {
                $delta = $p.TotalProcessorTime.TotalMilliseconds - $first[$p.Id]
            } catch { continue }
            if ($delta -le 0) { continue }
            $pct = [math]::Round(($delta / $SampleMs / $cores) * 100, 1)
            if ($pct -lt 0.5) { continue }
            $rows += [pscustomobject]@{
                Name      = $p.ProcessName
                CpuPct    = $pct
                MemoryMB  = [math]::Round($p.WorkingSet64 / 1MB, 0)
            }
        }
        return @($rows | Sort-Object CpuPct -Descending | Select-Object -First 8)
    } catch {
        return @()
    }
}

function Get-MemoryHogs {
    try {
        return @(Get-Process -ErrorAction SilentlyContinue |
            Sort-Object WorkingSet64 -Descending |
            Select-Object -First 8 |
            ForEach-Object {
                [pscustomobject]@{
                    Name     = $_.ProcessName
                    MemoryMB = [math]::Round($_.WorkingSet64 / 1MB, 0)
                }
            })
    } catch {
        return @()
    }
}

function Get-StorageSnapshot {
    $result = [pscustomobject]@{
        FreeGB       = 0
        TotalGB      = 0
        FreePercent  = 0
        MediaType    = 'unknown'
        HealthStatus = 'unknown'
        WearPercent  = $null
        TempCelsius  = $null
        PowerOnHours = $null
    }

    try {
        $vol = Get-Volume -DriveLetter ($env:SystemDrive.TrimEnd(':')) -ErrorAction Stop
        $result.FreeGB  = [math]::Round($vol.SizeRemaining / 1GB, 1)
        $result.TotalGB = [math]::Round($vol.Size / 1GB, 1)
        if ($vol.Size -gt 0) {
            $result.FreePercent = [math]::Round(($vol.SizeRemaining / $vol.Size) * 100, 1)
        }
    } catch { }

    try {
        $disk = Get-PhysicalDisk -ErrorAction Stop | Where-Object { $_.DeviceId -eq 0 } | Select-Object -First 1
        if (-not $disk) { $disk = Get-PhysicalDisk -ErrorAction Stop | Select-Object -First 1 }
        if ($disk) {
            $result.MediaType    = "$($disk.MediaType)"
            $result.HealthStatus = "$($disk.HealthStatus)"

            $rc = $disk | Get-StorageReliabilityCounter -ErrorAction SilentlyContinue
            if ($rc) {
                if ($null -ne $rc.Wear)         { $result.WearPercent  = $rc.Wear }
                if ($null -ne $rc.Temperature)  { $result.TempCelsius  = $rc.Temperature }
                if ($null -ne $rc.PowerOnHours) { $result.PowerOnHours = $rc.PowerOnHours }
            }
        }
    } catch { }

    return $result
}

function Get-Benchmark {
    <#  The objective before/after record.  #>
    param([switch]$SkipDiskTest)

    Write-OptLog 'Measuring the machine...' 'Info'

    $bench = [pscustomobject]@{
        Taken             = Get-Date
        BootTimeMs        = Get-BootTimeMs
        Memory            = Get-MemorySnapshot
        Storage           = Get-StorageSnapshot
        DiskWriteMBps     = $null
        StartupItemCount  = 0
        RunningProcesses  = 0
        RunningServices   = 0
    }

    if (-not $SkipDiskTest) {
        Write-OptLog 'Running a 256 MB disk write test...' 'Info'
        $bench.DiskWriteMBps = Get-DiskWriteSpeed
    }

    try { $bench.RunningProcesses = @(Get-Process -ErrorAction SilentlyContinue).Count } catch { }
    try { $bench.RunningServices  = @(Get-Service -ErrorAction SilentlyContinue | Where-Object { $_.Status -eq 'Running' }).Count } catch { }
    try { $bench.StartupItemCount = @(Get-StartupItems).Count } catch { }

    return $bench
}

function Save-Benchmark {
    param([Parameter(Mandatory)]$Benchmark, [Parameter(Mandatory)][string]$Label)
    $ctx = Get-OptContext
    $path = Join-Path $ctx.DataDir "benchmark-$($ctx.RunId)-$Label.json"
    try {
        $Benchmark | ConvertTo-Json -Depth 6 | Set-Content -Path $path -Encoding UTF8
    } catch {
        Write-OptLog "Could not save the $Label benchmark: $($_.Exception.Message)" 'Warn'
    }
}

function Test-PendingReboot {
    $keys = @(
        'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Component Based Servicing\RebootPending',
        'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\WindowsUpdate\Auto Update\RebootRequired'
    )
    foreach ($k in $keys) {
        if (Test-Path $k) { return $true }
    }
    try {
        $pfro = Get-ItemProperty -Path 'HKLM:\SYSTEM\CurrentControlSet\Control\Session Manager' -Name 'PendingFileRenameOperations' -ErrorAction SilentlyContinue
        if ($pfro -and $pfro.PendingFileRenameOperations) { return $true }
    } catch { }
    return $false
}

function Get-Findings {
    <#
        The culprit hunt. On a new, fast machine this is the part that matters:
        a healthy Ryzen laptop that feels slow usually has one specific problem,
        not a hundred small ones.

        Severity: High / Medium / Low
    #>
    Write-OptLog 'Looking for what is actually slowing this machine down...' 'Info'

    $findings = @()

    function New-Finding {
        param($Title, $Detail, $Severity, $Fix)
        [pscustomobject]@{ Title = $Title; Detail = $Detail; Severity = $Severity; Fix = $Fix }
    }

    # --- Heavyweight third-party security software -------------------------
    $securityBloat = @(
        @{ Match = 'McAfee';      Label = 'McAfee' },
        @{ Match = 'Norton';      Label = 'Norton' },
        @{ Match = 'HP Wolf';     Label = 'HP Wolf Security' },
        @{ Match = 'HP Sure';     Label = 'HP Sure Click / Sure Sense' }
    )
    $installed = @(Get-InstalledWin32App)
    foreach ($s in $securityBloat) {
        $hit = $installed | Where-Object { $_.Name -like "*$($s.Match)*" } | Select-Object -First 1
        if ($hit) {
            $findings += New-Finding `
                -Title "$($s.Label) is installed" `
                -Detail "$($hit.Name) runs constantly and scans file and network activity. On a preinstalled HP machine this is the single most common cause of a new laptop feeling sluggish everywhere at once - slow boot, slow file operations, slow browsing, warm chassis. Windows Defender already provides protection." `
                -Severity 'High' `
                -Fix 'Uninstall it from the Bloatware tab.'
        }
    }

    # --- Something is eating the CPU right now -----------------------------
    $hogs = Get-CpuHogs
    $topHog = $hogs | Select-Object -First 1
    if ($topHog -and $topHog.CpuPct -ge 15) {
        $known = @{
            'MsMpEng'        = 'Windows Defender is running a scan. This is normal and finishes on its own.'
            'TiWorker'       = 'Windows Update is installing components in the background. Let it finish, then reboot.'
            'TrustedInstaller' = 'Windows Update is servicing the OS. Let it finish, then reboot.'
            'SearchIndexer'  = 'Windows Search is building its index. On a new laptop this runs for the first few days, then stops.'
            'WUDFHost'       = 'A driver host is busy - often a fingerprint reader or sensor driver misbehaving.'
            'CompatTelRunner' = 'Windows compatibility telemetry. Safe to disable via the telemetry service.'
        }
        $explain = $known[$topHog.Name]
        if (-not $explain) { $explain = "Investigate what $($topHog.Name) is and whether you need it running." }

        $findings += New-Finding `
            -Title "$($topHog.Name) is using $($topHog.CpuPct)% CPU right now" `
            -Detail $explain `
            -Severity $(if ($topHog.CpuPct -ge 40) { 'High' } else { 'Medium' }) `
            -Fix 'See the detail above - some of these are temporary and correct themselves.'
    }

    # --- Memory pressure ---------------------------------------------------
    $mem = Get-MemorySnapshot
    if ($mem.UsedPercent -ge 85) {
        $memHogs = (Get-MemoryHogs | Select-Object -First 3 | ForEach-Object { "$($_.Name) ($($_.MemoryMB) MB)" }) -join ', '
        $findings += New-Finding `
            -Title "RAM is $($mem.UsedPercent)% full" `
            -Detail "Only $($mem.FreeGB) GB free of $($mem.TotalGB) GB. Windows starts paging to disk above roughly 85%, which is what 'everything lags' feels like. Biggest consumers: $memHogs." `
            -Severity 'High' `
            -Fix 'Close what you are not using, and trim startup apps so fewer things load at boot.'
    }

    # --- Disk space --------------------------------------------------------
    $stor = Get-StorageSnapshot
    if ($stor.FreePercent -gt 0 -and $stor.FreePercent -lt 10) {
        $findings += New-Finding `
            -Title "System drive is $([math]::Round(100 - $stor.FreePercent,1))% full" `
            -Detail "Only $($stor.FreeGB) GB free. An SSD below 10% free slows down measurably, and Windows needs headroom for updates and the page file." `
            -Severity 'High' `
            -Fix 'Enable the Cleanup module, or move large files off the drive.'
    }

    # --- Drive health ------------------------------------------------------
    if ($stor.HealthStatus -and $stor.HealthStatus -notin @('Healthy', 'unknown')) {
        $findings += New-Finding `
            -Title "Drive health reports '$($stor.HealthStatus)'" `
            -Detail 'The drive itself is reporting a problem. No amount of software tuning fixes failing storage. Back up now.' `
            -Severity 'High' `
            -Fix 'Back up your data and contact HP support - this machine should still be under warranty.'
    }

    # --- Pending reboot ----------------------------------------------------
    if (Test-PendingReboot) {
        $findings += New-Finding `
            -Title 'Windows is waiting for a restart' `
            -Detail 'Updates are staged but not applied. In this state Windows keeps servicing processes running and can feel sluggish until you reboot.' `
            -Severity 'Medium' `
            -Fix 'Restart the laptop - do this before judging any optimization results.'
    }

    # --- Uptime ------------------------------------------------------------
    $sys = Get-SystemProfile
    if ($sys.UptimeHours -gt 168) {
        $findings += New-Finding `
            -Title "This machine has been up for $([math]::Round($sys.UptimeHours / 24, 1)) days" `
            -Detail 'Long uptime accumulates leaked memory and stale state. Fast Startup means shutting down is not the same as restarting.' `
            -Severity 'Low' `
            -Fix 'Use Restart, not Shut down.'
    }

    # --- Power plan --------------------------------------------------------
    try {
        $active = (& powercfg.exe /getactivescheme 2>&1) -join ' '
        if ($active -match 'Power saver') {
            $findings += New-Finding `
                -Title 'The laptop is on the Power saver plan' `
                -Detail 'Power saver caps the CPU well below what a Ryzen 5 7000 can do. This alone can make a fast machine feel like a slow one.' `
                -Severity 'High' `
                -Fix 'The Power module fixes this automatically.'
        }
    } catch { }

    # --- Startup load ------------------------------------------------------
    $startup = @(Get-StartupItems | Where-Object { $_.Enabled })
    if ($startup.Count -ge 10) {
        $findings += New-Finding `
            -Title "$($startup.Count) programs launch at startup" `
            -Detail 'Each one competes for CPU and disk during the first minute after login. This is the usual reason a fast laptop takes a long time to become usable.' `
            -Severity 'Medium' `
            -Fix 'The Startup module disables the ones that are safe to disable.'
    }

    # --- Windows own boot measurements -------------------------------------
    foreach ($c in (Get-SlowBootContributors | Where-Object { $_.DelayMs -ge 3000 } | Select-Object -First 3)) {
        $findings += New-Finding `
            -Title "$($c.Name) delayed boot by $([math]::Round($c.DelayMs / 1000, 1))s" `
            -Detail "Windows' own performance log recorded this $($c.Kind.ToLower()) slowing startup across $($c.Count) boot(s). This is a measurement, not an estimate." `
            -Severity 'Medium' `
            -Fix 'If it is an app you do not need at login, disable it in the Startup module.'
    }

    if ($findings.Count -eq 0) {
        $findings += New-Finding `
            -Title 'No specific problem found' `
            -Detail 'The diagnostic pass did not find a single dominant culprit. The optimization modules will still trim startup load and fix the power plan, but expect modest gains - this machine looks healthy.' `
            -Severity 'Low' `
            -Fix 'Run the optimization and compare the before/after numbers.'
    }

    $order = @{ 'High' = 0; 'Medium' = 1; 'Low' = 2 }
    return @($findings | Sort-Object { $order[$_.Severity] })
}

Export-ModuleMember -Function Get-SystemProfile, Get-Benchmark, Save-Benchmark, Get-Findings,
    Get-MemorySnapshot, Get-StorageSnapshot, Get-CpuHogs, Get-MemoryHogs, Get-BootTimeMs,
    Get-SlowBootContributors, Get-DiskWriteSpeed, Test-PendingReboot
