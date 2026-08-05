<#
    Graphics.psm1 - integrated graphics: what can be fixed, and what cannot.

    Be clear about the limits. Two of the most common complaints on a laptop
    like this have no software fix at all:

      * "The screen looks brighter from above and darker from below."
        That is the panel, not a setting. TN panels shift colour and brightness
        with vertical viewing angle, and the shift is always worse from below.
        No driver, registry key or program changes it. Only a different panel
        does.

      * "The graphics are weak."
        The GPU is soldered into the CPU. Nothing makes it a faster chip.

    What CAN be fixed is real, though, and this module finds it:

      * Single-channel memory. A Ryzen's integrated GPU has no memory of its
        own - it borrows system RAM, so its speed is limited by memory
        bandwidth. One 16 GB stick gives it half the bandwidth of two 8 GB
        sticks. This is the single biggest lever on integrated graphics
        performance and it is very often wrong on prebuilt laptops.
      * A generic Microsoft display driver instead of the real AMD one.
      * The panel running below its maximum refresh rate.
      * Hardware-accelerated GPU scheduling left off.
      * AMD switchable graphics set to save power rather than perform.
#>

Set-StrictMode -Version 2.0

$script:GraphicsDriversKey = 'HKLM:\SYSTEM\CurrentControlSet\Control\GraphicsDrivers'

# AMD/Intel switchable dynamic graphics, exposed through powercfg.
$script:SwitchableSubGroup = 'e276e160-7cb0-43c6-b20b-73f5dce39954'
$script:SwitchableSetting  = 'a1662ab2-9d34-4e53-ba8b-2639b9e20857'

function Get-GraphicsReport {
    $report = [pscustomobject]@{
        Adapters       = @()
        MemoryModules  = @()
        ChannelCount   = 0
        TotalRamGB     = 0
        IsSingleChannel = $false
        CurrentRefresh = $null
        MaxRefresh     = $null
        Resolution     = $null
        HagsEnabled    = $null
        MonitorName    = $null
    }

    # --- adapters ----------------------------------------------------------
    try {
        foreach ($v in (Get-CimInstance Win32_VideoController -ErrorAction Stop)) {
            $report.Adapters += [pscustomobject]@{
                Name          = $v.Name
                DriverVersion = $v.DriverVersion
                DriverDate    = $v.DriverDate
                VideoRamMB    = $(if ($v.AdapterRAM) { [math]::Round($v.AdapterRAM / 1MB, 0) } else { $null })
                IsGeneric     = ($v.Name -match 'Microsoft Basic Display')
            }
            if ($null -ne $v.CurrentRefreshRate) { $report.CurrentRefresh = $v.CurrentRefreshRate }
            if ($null -ne $v.MaxRefreshRate)     { $report.MaxRefresh     = $v.MaxRefreshRate }
            if ($v.CurrentHorizontalResolution) {
                $report.Resolution = "$($v.CurrentHorizontalResolution) x $($v.CurrentVerticalResolution)"
            }
        }
    } catch { }

    # --- memory layout -----------------------------------------------------
    try {
        $sticks = @(Get-CimInstance Win32_PhysicalMemory -ErrorAction Stop)
        foreach ($s in $sticks) {
            $report.MemoryModules += [pscustomobject]@{
                CapacityGB = [math]::Round($s.Capacity / 1GB, 1)
                SpeedMHz   = $s.Speed
                Slot       = "$($s.DeviceLocator)"
                Bank       = "$($s.BankLabel)"
            }
        }
        $report.ChannelCount = $sticks.Count
        $report.TotalRamGB = [math]::Round((($sticks | Measure-Object Capacity -Sum).Sum) / 1GB, 1)
        $report.IsSingleChannel = ($sticks.Count -eq 1)
    } catch { }

    # --- hardware-accelerated GPU scheduling -------------------------------
    try {
        $hags = Get-ItemProperty -Path $script:GraphicsDriversKey -Name 'HwSchMode' -ErrorAction SilentlyContinue
        if ($hags) { $report.HagsEnabled = ($hags.HwSchMode -eq 2) }
    } catch { }

    # --- monitor identity --------------------------------------------------
    try {
        $mon = Get-CimInstance -Namespace 'root/wmi' -ClassName WmiMonitorID -ErrorAction Stop | Select-Object -First 1
        if ($mon -and $mon.UserFriendlyName) {
            $chars = @($mon.UserFriendlyName | Where-Object { $_ -gt 0 })
            $report.MonitorName = -join ($chars | ForEach-Object { [char]$_ })
        }
    } catch { }

    return $report
}

function Get-GraphicsFindings {
    <#  Honest reporting. Several of these are deliberately not auto-fixable.  #>
    $report = Get-GraphicsReport
    $findings = @()

    function New-GfxFinding {
        param($Title, $Detail, $Severity, $Fix)
        [pscustomobject]@{ Title = $Title; Detail = $Detail; Severity = $Severity; Fix = $Fix }
    }

    # --- the big one: memory channels --------------------------------------
    if ($report.IsSingleChannel -and $report.ChannelCount -eq 1) {
        $stick = $report.MemoryModules | Select-Object -First 1
        $size = if ($stick) { "$($stick.CapacityGB) GB" } else { 'one module' }

        $findings += New-GfxFinding `
            -Title 'Memory is running in single-channel mode' `
            -Detail "This laptop has $size of RAM in a single stick. A Ryzen's integrated graphics has no memory of its own - it borrows system RAM, so its performance is limited by memory bandwidth more than anything else. One stick gives it roughly half the bandwidth of two. This is the largest single improvement available to integrated graphics, and it is a hardware change, not a setting: adding a second matching stick typically improves integrated GPU performance by 20-40%." `
            -Severity 'High' `
            -Fix 'Check whether the laptop has a second free SODIMM slot, then fit a second matching stick. No software can substitute for this.'
    } elseif ($report.ChannelCount -ge 2) {
        $findings += New-GfxFinding `
            -Title 'Memory is running in dual-channel mode' `
            -Detail "$($report.ChannelCount) memory modules detected, totalling $($report.TotalRamGB) GB. The integrated GPU already has the memory bandwidth it needs - this is the correct configuration." `
            -Severity 'Low' `
            -Fix 'Nothing to do.'
    }

    # --- generic driver ----------------------------------------------------
    foreach ($a in $report.Adapters) {
        if ($a.IsGeneric) {
            $findings += New-GfxFinding `
                -Title 'Windows is using the generic display driver' `
                -Detail "'$($a.Name)' is Microsoft's fallback driver, not AMD's. It has no hardware acceleration worth the name - video playback, scrolling and anything graphical will feel sluggish, and the panel may not run at its correct refresh rate." `
                -Severity 'High' `
                -Fix 'Install the AMD Radeon driver from HP''s support page for this model, or from AMD directly.'
        }
    }

    # --- driver age --------------------------------------------------------
    foreach ($a in $report.Adapters) {
        if ($a.IsGeneric -or -not $a.DriverDate) { continue }
        try {
            $age = ((Get-Date) - [datetime]$a.DriverDate).TotalDays
            if ($age -gt 540) {
                $findings += New-GfxFinding `
                    -Title "The graphics driver is $([math]::Round($age / 365, 1)) years old" `
                    -Detail "$($a.Name), driver $($a.DriverVersion), dated $([datetime]$a.DriverDate | Get-Date -Format 'yyyy-MM-dd'). AMD's integrated graphics drivers have improved substantially over that period." `
                    -Severity 'Medium' `
                    -Fix 'Update it from AMD''s website - their installer is more current than HP''s.'
            }
        } catch { }
    }

    # --- refresh rate ------------------------------------------------------
    if ($report.CurrentRefresh -and $report.MaxRefresh -and $report.MaxRefresh -gt $report.CurrentRefresh) {
        $findings += New-GfxFinding `
            -Title "The display is running at $($report.CurrentRefresh) Hz but supports $($report.MaxRefresh) Hz" `
            -Detail 'Everything on screen is being drawn less often than the panel can manage. Cursor movement and scrolling look choppier than they need to.' `
            -Severity 'Medium' `
            -Fix 'Settings > System > Display > Advanced display, and pick the highest refresh rate.'
    }

    # --- the panel itself --------------------------------------------------
    $panelName = if ($report.MonitorName) { $report.MonitorName } else { 'the built-in display' }
    $findings += New-GfxFinding `
        -Title 'Brightness shifting with viewing angle is the panel, not a setting' `
        -Detail "If $panelName looks brighter from above and noticeably darker or washed out from below, that is the signature of a TN panel. TN panels change colour and brightness with vertical viewing angle, and the shift is always worst when looking up from underneath. It is a physical property of how the liquid crystals are arranged. No driver, registry key, colour profile or program changes it - this tool cannot fix it and neither can any other. An IPS panel does not do it; that is the difference you would be paying for." `
        -Severity 'Low' `
        -Fix 'Tilt the lid so your eyes are level with the middle of the screen - that is the sweet spot on a TN panel. A permanent fix means an IPS panel: an external monitor, or a panel replacement if this model has an IPS option.'

    $order = @{ 'High' = 0; 'Medium' = 1; 'Low' = 2 }
    return @($findings | Sort-Object { $order[$_.Severity] })
}

function Invoke-GraphicsTuning {
    <#
        The two changes that are genuinely safe and genuinely help integrated
        graphics. Both are reversible; both need a reboot to take effect.
    #>
    $ctx = Get-OptContext
    Write-OptLog 'Checking graphics configuration...' 'Info'

    $report = Get-GraphicsReport
    $changed = 0

    foreach ($a in $report.Adapters) {
        Write-OptLog "Graphics: $($a.Name), driver $($a.DriverVersion)." 'Finding'
    }
    if ($report.Resolution) {
        $hz = if ($report.CurrentRefresh) { ", $($report.CurrentRefresh) Hz" } else { '' }
        Write-OptLog "Display: $($report.Resolution)$hz." 'Finding'
    }

    # --- memory channels: report, never pretend to fix ---------------------
    if ($report.IsSingleChannel) {
        Write-OptLog 'Memory is single-channel. That is the biggest limit on this integrated GPU, and it is a hardware change - a second RAM stick - not something software can do.' 'Warn'
    } else {
        Write-OptLog "Memory is dual-channel across $($report.ChannelCount) modules - correct for integrated graphics." 'Finding'
    }

    # --- hardware-accelerated GPU scheduling -------------------------------
    if ($report.HagsEnabled -eq $false) {
        $key = $script:GraphicsDriversKey
        $old = 1
        try {
            $existing = Get-ItemProperty -Path $key -Name 'HwSchMode' -ErrorAction SilentlyContinue
            if ($existing) { $old = $existing.HwSchMode }
        } catch { }

        $action = { Set-ItemProperty -Path $key -Name 'HwSchMode' -Value 2 -Type DWord -ErrorAction Stop }.GetNewClosure()

        if (Invoke-Guarded `
                -Description 'Enabled hardware-accelerated GPU scheduling - lets the GPU manage its own work queue instead of the CPU doing it (takes effect after a restart)' `
                -UndoType 'Registry' `
                -UndoData @{ KeyPath = $key; ValueName = 'HwSchMode'; OldValue = $old } `
                -Action $action) {
            $changed++
        }
    } elseif ($report.HagsEnabled -eq $true) {
        Write-OptLog 'Hardware-accelerated GPU scheduling is already on.' 'Finding'
    }

    # --- switchable graphics policy on AC ----------------------------------
    $active = Get-ActivePowerScheme
    if ($active) {
        $current = Get-PowerValue -Scheme $active.Guid -SubGroup $script:SwitchableSubGroup -Setting $script:SwitchableSetting
        # 0 = force power saving, 1 = minimise power, 2 = optimise performance, 3 = maximise performance
        if ($current -and $null -ne $current.Ac -and $current.Ac -lt 3) {
            $scheme = $active.Guid
            $sub = $script:SwitchableSubGroup
            $set = $script:SwitchableSetting
            $oldAc = $current.Ac
            $oldDc = $current.Dc

            $action = { Set-PowerValue -Scheme $scheme -SubGroup $sub -Setting $set -AcValue 3 }.GetNewClosure()

            if (Invoke-Guarded `
                    -Description 'Set switchable graphics to maximise performance while plugged in' `
                    -UndoType 'PowerValue' `
                    -UndoData @{ Scheme = $scheme; SubGroup = $sub; Setting = $set; OldAcValue = $oldAc; OldDcValue = $oldDc } `
                    -Action $action) {
                $changed++
            }
        }
    }

    # --- refresh rate: tell, do not touch ----------------------------------
    if ($report.CurrentRefresh -and $report.MaxRefresh -and $report.MaxRefresh -gt $report.CurrentRefresh) {
        Write-OptLog "The display is set to $($report.CurrentRefresh) Hz but supports $($report.MaxRefresh) Hz. Changing it programmatically can leave a laptop with a black screen, so set it yourself: Settings > System > Display > Advanced display." 'Warn'
    }

    # --- the panel ---------------------------------------------------------
    Write-OptLog 'Note: if the screen looks brighter from above and darker from below, that is a TN panel viewing-angle characteristic. It is physical, not a setting - no software can change it. See the graphics section of the Details tab.' 'Finding'

    $ctx.Stats.GraphicsTuned += $changed
    if ($changed -eq 0) {
        Write-OptLog 'Graphics settings were already correct - nothing to change.' 'Finding'
    }
    return $changed
}

Export-ModuleMember -Function Get-GraphicsReport, Get-GraphicsFindings, Invoke-GraphicsTuning
