<#
.SYNOPSIS
    Laptop Optimizer - a Windows desktop app that measures the machine, finds
    what is actually slowing it down, and fixes the safe things automatically.

.DESCRIPTION
    Written in PowerShell with a WPF interface so it runs on any Windows 10/11
    machine with nothing installed.

    Design rules:
      * Every change is recorded in an undo file before it is applied.
      * A System Restore point is created before the first change of a run.
      * Uninstalls are never automatic - they are the only irreversible action.
      * Preview mode is on by default.

.PARAMETER DryRun
    Start with preview mode already enabled. This is the default in the UI.

.PARAMETER Console
    Run the whole optimization in the console with no window. Useful for testing
    over a remote session.

.EXAMPLE
    .\Optimize.ps1
    .\Optimize.ps1 -Console -DryRun
#>

[CmdletBinding()]
param(
    [switch]$DryRun,
    [switch]$Console
)

$ErrorActionPreference = 'Stop'
$script:Root = Split-Path -Parent $MyInvocation.MyCommand.Definition

# ---------------------------------------------------------------------------
# Modules
# ---------------------------------------------------------------------------

$moduleOrder = @('Common', 'Safety', 'Startup', 'Services', 'Power', 'Graphics', 'Storage', 'Bloatware', 'Cleanup', 'Diagnostics')
foreach ($m in $moduleOrder) {
    Import-Module (Join-Path $script:Root "modules\$m.psm1") -Force -DisableNameChecking
}

$null = Initialize-OptContext -RootPath $script:Root -DryRun:$DryRun
$script:Ctx = Get-OptContext

# ---------------------------------------------------------------------------
# Console mode - no UI, straight through
# ---------------------------------------------------------------------------

if ($Console) {
    Register-OptUiCallback {
        param($Message, $Level)
        $color = switch ($Level) {
            'Change'  { 'Green' }
            'Warn'    { 'Yellow' }
            'Error'   { 'Red' }
            'Finding' { 'Cyan' }
            default   { 'Gray' }
        }
        Write-Host $Message -ForegroundColor $color
    }

    if (-not (Test-IsAdmin)) {
        Write-Host 'Not running as administrator - most changes will fail.' -ForegroundColor Yellow
    }

    $sys = Get-SystemProfile
    Write-Host "$($sys.Manufacturer) $($sys.Model) | $($sys.Cpu) | $($sys.RamTotalGB) GB RAM | $($sys.OsName)" -ForegroundColor White

    $before = Get-Benchmark
    Save-Benchmark -Benchmark $before -Label 'before'

    foreach ($f in Get-Findings) {
        Write-Host "[$($f.Severity)] $($f.Title)" -ForegroundColor Magenta
        Write-Host "        $($f.Detail)" -ForegroundColor Gray
    }

    if (-not $script:Ctx.DryRun) { New-SafetyCheckpoint | Out-Null }

    foreach ($f in Get-GraphicsFindings) {
        Write-Host "[GFX/$($f.Severity)] $($f.Title)" -ForegroundColor Magenta
        Write-Host "        $($f.Detail)" -ForegroundColor Gray
    }

    Invoke-StartupOptimization | Out-Null
    Invoke-ServiceTrim         | Out-Null
    Invoke-PowerTuning         | Out-Null
    Invoke-GraphicsTuning      | Out-Null
    Invoke-StorageOptimization | Out-Null
    Invoke-Cleanup             | Out-Null

    $after = Get-Benchmark -SkipDiskTest
    Save-Benchmark -Benchmark $after -Label 'after'

    Write-Host ''
    Write-Host "Startup items disabled : $($script:Ctx.Stats.StartupDisabled)"
    Write-Host "Services changed       : $($script:Ctx.Stats.ServicesChanged)"
    Write-Host "Power settings tuned   : $($script:Ctx.Stats.PowerTuned)"
    Write-Host "Failures               : $($script:Ctx.Stats.Failures)"
    Write-Host "Log                    : $($script:Ctx.LogPath)"
    return
}

# ---------------------------------------------------------------------------
# WPF
# ---------------------------------------------------------------------------

Add-Type -AssemblyName PresentationFramework
Add-Type -AssemblyName PresentationCore
Add-Type -AssemblyName WindowsBase
Add-Type -AssemblyName System.Xaml

$xamlPath = Join-Path $script:Root 'ui\MainWindow.xaml'
[xml]$xaml = Get-Content -Path $xamlPath -Raw -Encoding UTF8
$reader = New-Object System.Xml.XmlNodeReader $xaml
$script:Window = [Windows.Markup.XamlReader]::Load($reader)

function Find-Control {
    param([string]$Name)
    return $script:Window.FindName($Name)
}

$script:MachineLine       = Find-Control 'MachineLine'
$script:AdminText         = Find-Control 'AdminText'
$script:AdminBadge        = Find-Control 'AdminBadge'
$script:RunButton         = Find-Control 'RunButton'
$script:ScanButton        = Find-Control 'ScanButton'
$script:ScanBloatButton   = Find-Control 'ScanBloatButton'
$script:RemoveBloatButton = Find-Control 'RemoveBloatButton'
$script:DetailsButton     = Find-Control 'DetailsButton'
$script:RefreshUndoButton = Find-Control 'RefreshUndoButton'
$script:OpenLogButton     = Find-Control 'OpenLogButton'
$script:StatusText        = Find-Control 'StatusText'
$script:Progress          = Find-Control 'Progress'
$script:LogPanel          = Find-Control 'LogPanel'
$script:LogScroller       = Find-Control 'LogScroller'
$script:SummaryPanel      = Find-Control 'SummaryPanel'
$script:SummaryCard       = Find-Control 'SummaryCard'
$script:FindingsPanel     = Find-Control 'FindingsPanel'
$script:BloatPanel        = Find-Control 'BloatPanel'
$script:DetailsPanel      = Find-Control 'DetailsPanel'
$script:UndoPanel         = Find-Control 'UndoPanel'
$script:DryRunBox         = Find-Control 'DryRunBox'
$script:CleanupBox        = Find-Control 'CleanupBox'
$script:FooterNote        = Find-Control 'FooterNote'
$script:Tabs              = Find-Control 'Tabs'

$script:Busy = $false
$script:BloatControls = @()

# ---------------------------------------------------------------------------
# UI helpers
# ---------------------------------------------------------------------------

function Update-Ui {
    <#
        WPF's equivalent of DoEvents. The optimization runs on the UI thread so
        that every module can log straight into the window; this keeps the
        window repainting while it works.
    #>
    try {
        $script:Window.Dispatcher.Invoke(
            [System.Windows.Threading.DispatcherPriority]::Background,
            [action]{}) | Out-Null
    } catch { }
}

function New-Brush {
    param([string]$Hex)
    return (New-Object System.Windows.Media.SolidColorBrush(
        [System.Windows.Media.ColorConverter]::ConvertFromString($Hex)))
}

$script:LevelColor = @{
    'Info'    = '#9BA3AF'
    'Change'  = '#3DDC97'
    'Warn'    = '#F5A623'
    'Error'   = '#FF6B6B'
    'Finding' = '#4C9AFF'
}

function Add-LogLine {
    param([string]$Message, [string]$Level = 'Info')

    $tb = New-Object System.Windows.Controls.TextBlock
    $tb.Text = $Message
    $tb.Margin = '0,2,0,2'
    $tb.FontSize = 12.5
    $tb.TextWrapping = 'Wrap'

    $hex = $script:LevelColor[$Level]
    if (-not $hex) { $hex = '#9BA3AF' }
    $tb.Foreground = New-Brush $hex

    [void]$script:LogPanel.Children.Add($tb)
    try { $script:LogScroller.ScrollToEnd() } catch { }
    Update-Ui
}

function Set-Status {
    param([string]$Text, [int]$Percent = -1)
    $script:StatusText.Text = $Text
    if ($Percent -ge 0) { $script:Progress.Value = $Percent }
    Update-Ui
}

function Clear-Panel {
    param($Panel)
    $Panel.Children.Clear()
}

function Add-Heading {
    param($Panel, [string]$Text, [string]$Color = '#E6E8EC', [int]$TopMargin = 18)
    $tb = New-Object System.Windows.Controls.TextBlock
    $tb.Text = $Text
    $tb.FontSize = 15
    $tb.FontWeight = 'SemiBold'
    $tb.Foreground = New-Brush $Color
    $tb.Margin = "0,$TopMargin,0,8"
    [void]$Panel.Children.Add($tb)
}

function Add-Body {
    param($Panel, [string]$Text, [string]$Color = '#9BA3AF', [int]$Size = 12)
    $tb = New-Object System.Windows.Controls.TextBlock
    $tb.Text = $Text
    $tb.FontSize = $Size
    $tb.Foreground = New-Brush $Color
    $tb.TextWrapping = 'Wrap'
    $tb.Margin = '0,0,0,4'
    [void]$Panel.Children.Add($tb)
}

function Add-Card {
    <#  A bordered block with a title, a body and an optional accent stripe.  #>
    param(
        $Panel,
        [string]$Title,
        [string]$Body,
        [string]$Footer = '',
        [string]$Accent = '#4C9AFF'
    )

    $border = New-Object System.Windows.Controls.Border
    $border.Background = New-Brush '#232733'
    $border.CornerRadius = [System.Windows.CornerRadius]::new(6)
    $border.Padding = '16'
    $border.Margin = '0,0,0,10'
    $border.BorderThickness = [System.Windows.Thickness]::new(3, 0, 0, 0)
    $border.BorderBrush = New-Brush $Accent

    $stack = New-Object System.Windows.Controls.StackPanel

    $t = New-Object System.Windows.Controls.TextBlock
    $t.Text = $Title
    $t.FontSize = 14
    $t.FontWeight = 'SemiBold'
    $t.Foreground = New-Brush '#E6E8EC'
    $t.TextWrapping = 'Wrap'
    [void]$stack.Children.Add($t)

    if ($Body) {
        $b = New-Object System.Windows.Controls.TextBlock
        $b.Text = $Body
        $b.FontSize = 12.5
        $b.Foreground = New-Brush '#9BA3AF'
        $b.TextWrapping = 'Wrap'
        $b.Margin = '0,6,0,0'
        [void]$stack.Children.Add($b)
    }

    if ($Footer) {
        $f = New-Object System.Windows.Controls.TextBlock
        $f.Text = $Footer
        $f.FontSize = 12
        $f.Foreground = New-Brush $Accent
        $f.TextWrapping = 'Wrap'
        $f.Margin = '0,8,0,0'
        [void]$stack.Children.Add($f)
    }

    $border.Child = $stack
    [void]$Panel.Children.Add($border)
}

function Set-BusyState {
    param([bool]$Busy)
    $script:Busy = $Busy
    foreach ($b in @($script:RunButton, $script:ScanButton, $script:ScanBloatButton,
                     $script:RemoveBloatButton, $script:DetailsButton, $script:RefreshUndoButton)) {
        if ($b) { $b.IsEnabled = -not $Busy }
    }
    Update-Ui
}

# ---------------------------------------------------------------------------
# Header
# ---------------------------------------------------------------------------

$sys = Get-SystemProfile
$script:MachineLine.Text = "$($sys.Manufacturer) $($sys.Model)  |  $($sys.Cpu)  |  $($sys.RamTotalGB) GB RAM  |  $($sys.OsName) build $($sys.OsBuild)"

$script:IsAdmin = Test-IsAdmin
if ($script:IsAdmin) {
    $script:AdminText.Text = 'Administrator'
    $script:AdminText.Foreground = New-Brush '#3DDC97'
} else {
    $script:AdminText.Text = 'Not administrator - most fixes will fail'
    $script:AdminText.Foreground = New-Brush '#F5A623'
}

Register-OptUiCallback {
    param($Message, $Level)
    Add-LogLine -Message $Message -Level $Level
}

# ---------------------------------------------------------------------------
# Summary
# ---------------------------------------------------------------------------

function Show-Summary {
    param($Before, $After)

    Clear-Panel $script:SummaryPanel
    $script:SummaryCard.Visibility = 'Visible'

    $stats = $script:Ctx.Stats

    $title = New-Object System.Windows.Controls.TextBlock
    $title.Text = if ($script:Ctx.DryRun) { 'Preview complete - nothing was changed' } else { 'Done' }
    $title.FontSize = 17
    $title.FontWeight = 'SemiBold'
    $title.Foreground = New-Brush '#E6E8EC'
    [void]$script:SummaryPanel.Children.Add($title)

    $lines = @()
    $lines += "Startup programs disabled: $($stats.StartupDisabled)"
    $lines += "Background services trimmed: $($stats.ServicesChanged)"
    $lines += "Power settings corrected: $($stats.PowerTuned)"
    $lines += "Graphics settings corrected: $($stats.GraphicsTuned)"
    if ($stats.AppsRemoved -gt 0) { $lines += "Preinstalled apps removed: $($stats.AppsRemoved)" }
    if ($stats.BytesFreed -gt 0)  { $lines += "Disk space freed: $(Format-Bytes $stats.BytesFreed)" }
    if ($stats.Failures -gt 0)    { $lines += "Actions that failed: $($stats.Failures) - see the activity list" }

    foreach ($l in $lines) {
        Add-Body -Panel $script:SummaryPanel -Text $l -Color '#E6E8EC' -Size 13
    }

    # Honest reporting: RAM and disk can be re-measured now, boot time cannot.
    if ($Before -and $After) {
        $memBefore = $Before.Memory.UsedPercent
        $memAfter  = $After.Memory.UsedPercent
        Add-Body -Panel $script:SummaryPanel `
            -Text "RAM in use: $memBefore% before, $memAfter% now." -Color '#9BA3AF'
    }

    if ($Before -and $Before.BootTimeMs) {
        $secs = [math]::Round($Before.BootTimeMs / 1000, 1)
        Add-Body -Panel $script:SummaryPanel `
            -Text "Boot time was $secs seconds. That number cannot change until you restart - reboot, then run this again to see the real difference." `
            -Color '#9BA3AF'
    } else {
        Add-Body -Panel $script:SummaryPanel `
            -Text "Windows has not recorded a boot time yet on this machine. Restart once, then run this again to get a baseline." `
            -Color '#9BA3AF'
    }

    if ($script:Ctx.DryRun) {
        Add-Body -Panel $script:SummaryPanel `
            -Text 'This was a preview. Untick "Preview only" at the bottom and run again to apply these changes.' `
            -Color '#F5A623' -Size 13
    } else {
        Add-Body -Panel $script:SummaryPanel `
            -Text "Undo file saved: $($script:Ctx.UndoPath)" -Color '#4C9AFF'
    }
}

# ---------------------------------------------------------------------------
# Findings
# ---------------------------------------------------------------------------

function Show-Findings {
    Clear-Panel $script:FindingsPanel

    $findings = Get-Findings

    Add-Heading -Panel $script:FindingsPanel -Text 'Performance' -TopMargin 0
    foreach ($f in $findings) {
        $accent = switch ($f.Severity) {
            'High'   { '#FF6B6B' }
            'Medium' { '#F5A623' }
            default  { '#4C9AFF' }
        }
        Add-Card -Panel $script:FindingsPanel `
            -Title "$($f.Severity.ToUpper())  -  $($f.Title)" `
            -Body $f.Detail `
            -Footer "What to do: $($f.Fix)" `
            -Accent $accent
    }

    Add-Heading -Panel $script:FindingsPanel -Text 'Graphics and display'
    Add-Body -Panel $script:FindingsPanel -Text 'Some of these are hardware facts rather than settings. Where that is the case it says so plainly instead of pretending a program can fix it.'

    foreach ($f in Get-GraphicsFindings) {
        $accent = switch ($f.Severity) {
            'High'   { '#FF6B6B' }
            'Medium' { '#F5A623' }
            default  { '#4C9AFF' }
        }
        Add-Card -Panel $script:FindingsPanel `
            -Title "$($f.Severity.ToUpper())  -  $($f.Title)" `
            -Body $f.Detail `
            -Footer "What to do: $($f.Fix)" `
            -Accent $accent
    }

    return $findings
}

# ---------------------------------------------------------------------------
# Bloatware tab
# ---------------------------------------------------------------------------

function Show-Bloatware {
    Clear-Panel $script:BloatPanel
    $script:BloatControls = @()

    Set-Status 'Scanning installed software...' 20
    $items = Get-BloatwareCandidates
    Set-Status 'Ready.' 0

    if ($items.Count -eq 0) {
        Add-Body -Panel $script:BloatPanel -Text 'No known preinstalled bloatware found.' -Color '#3DDC97' -Size 13
        $script:RemoveBloatButton.IsEnabled = $false
        return
    }

    $groups = @(
        @{ Rec = 'Remove'; Title = 'Safe to remove'; Note = 'Pre-ticked. Nothing here is needed by the system.'; Accent = '#3DDC97' },
        @{ Rec = 'Ask';    Title = 'Your call';      Note = 'Depends entirely on whether you use them.';        Accent = '#F5A623' },
        @{ Rec = 'Keep';   Title = 'Worth keeping';  Note = 'Most bloatware lists strip these. Given how you use this laptop, they earn their place.'; Accent = '#4C9AFF' }
    )

    foreach ($g in $groups) {
        $groupItems = @($items | Where-Object { $_.Recommendation -eq $g.Rec })
        if ($groupItems.Count -eq 0) { continue }

        Add-Heading -Panel $script:BloatPanel -Text $g.Title -Color $g.Accent
        Add-Body    -Panel $script:BloatPanel -Text $g.Note

        foreach ($item in $groupItems) {
            $border = New-Object System.Windows.Controls.Border
            $border.Background = New-Brush '#232733'
            $border.CornerRadius = [System.Windows.CornerRadius]::new(6)
            $border.Padding = '14'
            $border.Margin = '0,0,0,8'

            $stack = New-Object System.Windows.Controls.StackPanel

            $cb = New-Object System.Windows.Controls.CheckBox
            $cb.Content = $item.Label
            $cb.FontSize = 13.5
            $cb.FontWeight = 'SemiBold'
            $cb.IsChecked = [bool]$item.Selected
            $cb.Tag = $item
            [void]$stack.Children.Add($cb)

            $desc = New-Object System.Windows.Controls.TextBlock
            $desc.Text = $item.Why
            $desc.FontSize = 12
            $desc.Foreground = New-Brush '#9BA3AF'
            $desc.TextWrapping = 'Wrap'
            $desc.Margin = '24,6,0,0'
            [void]$stack.Children.Add($desc)

            $border.Child = $stack
            [void]$script:BloatPanel.Children.Add($border)

            $script:BloatControls += $cb
        }
    }

    $script:RemoveBloatButton.IsEnabled = $true
}

# ---------------------------------------------------------------------------
# Details tab
# ---------------------------------------------------------------------------

function Show-Details {
    Clear-Panel $script:DetailsPanel

    Set-Status 'Reading startup entries, services and drive health...' 30

    # --- startup ------------------------------------------------------------
    $startup = Get-StartupItems
    $active  = @($startup | Where-Object { $_.Enabled })

    Add-Heading -Panel $script:DetailsPanel -Text "Startup entries ($($active.Count) active of $($startup.Count) total)" -TopMargin 0

    foreach ($group in @(
        @{ Filter = { $_.Enabled -and $_.JunkReason -and -not $_.Protected }; Title = 'Will be disabled'; Accent = '#3DDC97' },
        @{ Filter = { $_.Enabled -and -not $_.JunkReason -and -not $_.Protected }; Title = 'Left alone - not on the known-junk list'; Accent = '#F5A623' },
        @{ Filter = { $_.Enabled -and $_.Protected }; Title = 'Protected - never touched'; Accent = '#4C9AFF' },
        @{ Filter = { -not $_.Enabled }; Title = 'Already disabled'; Accent = '#5A6272' }
    )) {
        $rows = @($startup | Where-Object $group.Filter)
        if ($rows.Count -eq 0) { continue }

        Add-Body -Panel $script:DetailsPanel -Text "$($group.Title) ($($rows.Count))" -Color $group.Accent -Size 13

        foreach ($r in $rows) {
            $note = if ($r.JunkReason) { $r.JunkReason } else { $r.Command }
            Add-Card -Panel $script:DetailsPanel `
                -Title "$($r.Name)  -  $($r.Scope)" `
                -Body $note `
                -Accent $group.Accent
        }
    }

    # --- services -----------------------------------------------------------
    $plan = Get-ServicePlan
    Add-Heading -Panel $script:DetailsPanel -Text "Service plan ($($plan.Count) changes)"
    Add-Body -Panel $script:DetailsPanel -Text 'WSL, Docker, Hyper-V, SSH, databases, Windows Update, Defender, audio and Windows Search are whitelisted and never appear here.'

    if ($plan.Count -eq 0) {
        Add-Body -Panel $script:DetailsPanel -Text 'Nothing to change - services are already set sensibly.' -Color '#3DDC97' -Size 13
    } else {
        foreach ($p in $plan) {
            Add-Card -Panel $script:DetailsPanel `
                -Title "$($p.Label): $($p.Current) to $($p.Target)" `
                -Body $p.Why `
                -Accent '#3DDC97'
        }
    }

    # --- drive --------------------------------------------------------------
    $drive = Get-DriveHealthReport
    Add-Heading -Panel $script:DetailsPanel -Text 'Drive'

    $driveBody = @(
        "$($drive.Model)"
        "$($drive.MediaType), $($drive.SizeGB) GB total, $($drive.FreeGB) GB free ($($drive.FreePercent)%)"
        "Health: $($drive.HealthStatus)"
    )
    if ($null -ne $drive.WearPercent)  { $driveBody += "Wear: $($drive.WearPercent)% of rated endurance used" }
    if ($null -ne $drive.PowerOnHours) { $driveBody += "Powered on: $($drive.PowerOnHours) hours" }
    if ($null -ne $drive.TempCelsius)  { $driveBody += "Temperature: $($drive.TempCelsius) C" }
    if ($drive.TrimSupported -eq $false) { $driveBody += 'TRIM is disabled at the filesystem level.' }

    $driveAccent = if ($drive.HealthStatus -eq 'Healthy') { '#3DDC97' } else { '#FF6B6B' }
    Add-Card -Panel $script:DetailsPanel -Title 'System drive' -Body ($driveBody -join "`n") -Accent $driveAccent

    # --- graphics -----------------------------------------------------------
    $gfx = Get-GraphicsReport
    Add-Heading -Panel $script:DetailsPanel -Text 'Graphics and display'

    foreach ($a in $gfx.Adapters) {
        $adapterBody = @("Driver $($a.DriverVersion)")
        if ($a.DriverDate)  { $adapterBody += "Dated $([datetime]$a.DriverDate | Get-Date -Format 'yyyy-MM-dd')" }
        if ($a.VideoRamMB)  { $adapterBody += "$($a.VideoRamMB) MB reported video memory" }
        Add-Card -Panel $script:DetailsPanel -Title $a.Name -Body ($adapterBody -join "`n") `
            -Accent $(if ($a.IsGeneric) { '#FF6B6B' } else { '#4C9AFF' })
    }

    $memBody = @()
    foreach ($m in $gfx.MemoryModules) {
        $memBody += "$($m.Slot): $($m.CapacityGB) GB at $($m.SpeedMHz) MHz"
    }
    if ($gfx.IsSingleChannel) {
        $memBody += ''
        $memBody += 'Single-channel. The integrated GPU borrows system RAM, so memory bandwidth is its main limit. A second matching stick is the biggest available improvement to graphics performance - and it is hardware, not software.'
    } elseif ($gfx.ChannelCount -ge 2) {
        $memBody += ''
        $memBody += 'Dual-channel - the correct configuration for integrated graphics.'
    }
    Add-Card -Panel $script:DetailsPanel -Title "Memory layout ($($gfx.ChannelCount) module(s), $($gfx.TotalRamGB) GB)" `
        -Body ($memBody -join "`n") `
        -Accent $(if ($gfx.IsSingleChannel) { '#FF6B6B' } else { '#3DDC97' })

    $displayBody = @()
    if ($gfx.MonitorName)    { $displayBody += "Panel: $($gfx.MonitorName)" }
    if ($gfx.Resolution)     { $displayBody += "Resolution: $($gfx.Resolution)" }
    if ($gfx.CurrentRefresh) { $displayBody += "Refresh rate: $($gfx.CurrentRefresh) Hz (panel maximum $($gfx.MaxRefresh) Hz)" }
    if ($null -ne $gfx.HagsEnabled) {
        $displayBody += "Hardware-accelerated GPU scheduling: $(if ($gfx.HagsEnabled) { 'on' } else { 'off' })"
    }
    $displayBody += ''
    $displayBody += 'If the screen looks brighter from above and darker from below, that is a TN panel viewing-angle characteristic - physical, not a setting. No program can change it. Sitting level with the middle of the screen is the sweet spot; an IPS panel or external monitor is the only real fix.'

    Add-Card -Panel $script:DetailsPanel -Title 'Display' -Body ($displayBody -join "`n") -Accent '#4C9AFF'

    # --- cleanup preview ----------------------------------------------------
    $targets = Get-CleanupTargets
    $total = ($targets | Measure-Object Bytes -Sum).Sum
    if (-not $total) { $total = 0 }

    Add-Heading -Panel $script:DetailsPanel -Text "Cleanup preview - $(Format-Bytes $total) reclaimable"
    Add-Body -Panel $script:DetailsPanel -Text 'Cleanup is off by default. Tick "Include disk cleanup" at the bottom of the window to act on this.'
    foreach ($t in ($targets | Sort-Object Bytes -Descending)) {
        if ($t.Bytes -le 0) { continue }
        Add-Card -Panel $script:DetailsPanel -Title "$($t.Label) - $(Format-Bytes $t.Bytes)" -Body $t.Why -Accent '#5A6272'
    }

    Set-Status 'Ready.' 0
}

# ---------------------------------------------------------------------------
# Undo tab
# ---------------------------------------------------------------------------

function Show-UndoLogs {
    Clear-Panel $script:UndoPanel

    $logs = Get-UndoLogs
    if ($logs.Count -eq 0) {
        Add-Body -Panel $script:UndoPanel -Text 'No changes have been made yet, so there is nothing to undo.' -Size 13
        return
    }

    foreach ($log in $logs) {
        $border = New-Object System.Windows.Controls.Border
        $border.Background = New-Brush '#232733'
        $border.CornerRadius = [System.Windows.CornerRadius]::new(6)
        $border.Padding = '16'
        $border.Margin = '0,0,0,10'

        $stack = New-Object System.Windows.Controls.StackPanel

        $t = New-Object System.Windows.Controls.TextBlock
        $t.Text = "Run $($log.RunId) - $($log.RecordCount) change(s)"
        $t.FontSize = 14
        $t.FontWeight = 'SemiBold'
        [void]$stack.Children.Add($t)

        $detail = New-Object System.Windows.Controls.TextBlock
        $detail.Text = (@($log.Records | ForEach-Object { "- $($_.Description)" }) -join "`n")
        $detail.FontSize = 12
        $detail.Foreground = New-Brush '#9BA3AF'
        $detail.TextWrapping = 'Wrap'
        $detail.Margin = '0,8,0,0'
        [void]$stack.Children.Add($detail)

        $btn = New-Object System.Windows.Controls.Button
        $btn.Content = 'Undo this run'
        $btn.Style = $script:Window.FindResource('SecondaryButton')
        $btn.HorizontalAlignment = 'Left'
        $btn.Margin = '0,12,0,0'
        $btn.Tag = $log.Path
        $btn.Add_Click({
            param($sender, $e)
            $path = $sender.Tag
            $answer = [System.Windows.MessageBox]::Show(
                "Reverse every change from this run?`n`nUninstalled apps cannot be brought back this way - everything else will be restored exactly.",
                'Undo run', 'YesNo', 'Question')
            if ($answer -ne 'Yes') { return }

            Set-BusyState $true
            $script:Tabs.SelectedIndex = 0
            Add-LogLine 'Undoing a previous run...' 'Info'
            try {
                Invoke-UndoLog -Path $path
            } catch {
                Add-LogLine "Undo failed: $($_.Exception.Message)" 'Error'
            }
            Set-BusyState $false
            Show-UndoLogs
        })
        [void]$stack.Children.Add($btn)

        $border.Child = $stack
        [void]$script:UndoPanel.Children.Add($border)
    }
}

# ---------------------------------------------------------------------------
# The run
# ---------------------------------------------------------------------------

function Invoke-FullRun {
    Set-BusyState $true
    Clear-Panel $script:LogPanel
    $script:SummaryCard.Visibility = 'Collapsed'

    $script:Ctx.DryRun = [bool]$script:DryRunBox.IsChecked
    $doCleanup = [bool]$script:CleanupBox.IsChecked

    foreach ($k in @($script:Ctx.Stats.Keys)) { $script:Ctx.Stats[$k] = 0 }

    if ($script:Ctx.DryRun) {
        Add-LogLine 'PREVIEW MODE - every action below is described but not performed.' 'Warn'
    }

    if (-not $script:IsAdmin) {
        Add-LogLine 'Not running as administrator. Most changes will be refused by Windows. Close this and use the Start menu shortcut, which elevates.' 'Warn'
    }

    $before = $null
    $after = $null

    try {
        # 1. Baseline
        Set-Status 'Measuring the machine...' 8
        $before = Get-Benchmark
        Save-Benchmark -Benchmark $before -Label 'before'

        if ($before.BootTimeMs) {
            Add-LogLine "Boot time (Windows' own measurement): $([math]::Round($before.BootTimeMs / 1000, 1))s" 'Finding'
        }
        Add-LogLine "RAM: $($before.Memory.FreeGB) GB free of $($before.Memory.TotalGB) GB ($($before.Memory.UsedPercent)% in use)" 'Finding'
        if ($before.DiskWriteMBps) {
            Add-LogLine "Sequential disk write: $($before.DiskWriteMBps) MB/s" 'Finding'
        }

        # 2. Diagnosis
        Set-Status 'Looking for the actual cause...' 20
        $findings = Show-Findings
        $high = @($findings | Where-Object { $_.Severity -eq 'High' })
        if ($high.Count -gt 0) {
            Add-LogLine "$($high.Count) high-severity problem(s) found - see the 'What is actually wrong' tab. Those matter more than anything below." 'Warn'
        }

        # 3. Safety net
        if (-not $script:Ctx.DryRun) {
            Set-Status 'Creating a restore point...' 30
            New-SafetyCheckpoint | Out-Null
        }

        # 4. Modules
        Set-Status 'Trimming startup programs...' 45
        Invoke-StartupOptimization | Out-Null

        Set-Status 'Reviewing background services...' 60
        Invoke-ServiceTrim | Out-Null

        Set-Status 'Tuning power and thermals...' 68
        Invoke-PowerTuning | Out-Null

        Set-Status 'Checking graphics...' 78
        Invoke-GraphicsTuning | Out-Null

        Set-Status 'Checking the drive...' 84
        Invoke-StorageOptimization | Out-Null

        Set-Status 'Disk cleanup...' 90
        if ($doCleanup) {
            Invoke-Cleanup -Confirmed:(-not $script:Ctx.DryRun) | Out-Null
        } else {
            Invoke-Cleanup | Out-Null
        }

        # 5. Re-measure
        Set-Status 'Re-measuring...' 96
        $after = Get-Benchmark -SkipDiskTest
        Save-Benchmark -Benchmark $after -Label 'after'

        Set-Status 'Done.' 100
    } catch {
        Add-LogLine "The run stopped early: $($_.Exception.Message)" 'Error'
        Set-Status 'Stopped with an error.' 0
    } finally {
        Save-UndoLog
        Show-Summary -Before $before -After $after
        Set-BusyState $false
    }
}

# ---------------------------------------------------------------------------
# Events
# ---------------------------------------------------------------------------

$script:RunButton.Add_Click({
    if ($script:Busy) { return }

    if (-not $script:DryRunBox.IsChecked) {
        $answer = [System.Windows.MessageBox]::Show(
            "This will change startup programs, background services and power settings on this laptop.`n`nA restore point and an undo file are created first, so everything here is reversible.`n`nContinue?",
            'Apply changes', 'YesNo', 'Warning')
        if ($answer -ne 'Yes') { return }
    }

    Invoke-FullRun
})

$script:ScanButton.Add_Click({
    if ($script:Busy) { return }
    Set-BusyState $true
    Set-Status 'Diagnosing...' 40
    try { Show-Findings | Out-Null } catch { Add-LogLine "Diagnosis failed: $($_.Exception.Message)" 'Error' }
    Set-Status 'Ready.' 0
    Set-BusyState $false
})

$script:ScanBloatButton.Add_Click({
    if ($script:Busy) { return }
    Set-BusyState $true
    try { Show-Bloatware } catch { Add-LogLine "Scan failed: $($_.Exception.Message)" 'Error' }
    Set-BusyState $false
})

$script:RemoveBloatButton.Add_Click({
    if ($script:Busy) { return }

    $selected = @()
    foreach ($cb in $script:BloatControls) {
        $item = $cb.Tag
        $item.Selected = [bool]$cb.IsChecked
        if ($item.Selected) { $selected += $item }
    }

    if ($selected.Count -eq 0) {
        [System.Windows.MessageBox]::Show('Nothing is ticked.', 'Remove software', 'OK', 'Information') | Out-Null
        return
    }

    $names = ($selected | ForEach-Object { "- $($_.Label)" }) -join "`n"
    $answer = [System.Windows.MessageBox]::Show(
        "Uninstall these $($selected.Count) item(s)?`n`n$names`n`nThis is the one action the undo file cannot reverse. You would have to reinstall them by hand.",
        'Confirm uninstall', 'YesNo', 'Warning')
    if ($answer -ne 'Yes') { return }

    Set-BusyState $true
    $script:Ctx.DryRun = [bool]$script:DryRunBox.IsChecked
    $script:Tabs.SelectedIndex = 0

    try {
        Invoke-BloatwareRemoval -Items $selected | Out-Null
    } catch {
        Add-LogLine "Removal failed: $($_.Exception.Message)" 'Error'
    }

    Save-UndoLog
    Set-BusyState $false
    Show-Bloatware
})

$script:DetailsButton.Add_Click({
    if ($script:Busy) { return }
    Set-BusyState $true
    try { Show-Details } catch { Add-LogLine "Could not load details: $($_.Exception.Message)" 'Error' }
    Set-BusyState $false
})

$script:RefreshUndoButton.Add_Click({
    if ($script:Busy) { return }
    Show-UndoLogs
})

$script:OpenLogButton.Add_Click({
    Start-Process explorer.exe $script:Ctx.DataDir
})

$script:DryRunBox.Add_Checked({
    $script:FooterNote.Text = 'Preview is on. Nothing will be changed until you turn it off.'
    $script:FooterNote.Foreground = New-Brush '#9BA3AF'
})

$script:DryRunBox.Add_Unchecked({
    $script:FooterNote.Text = 'Preview is off. Changes will be applied, with a restore point and an undo file first.'
    $script:FooterNote.Foreground = New-Brush '#F5A623'
})

# ---------------------------------------------------------------------------
# Go
# ---------------------------------------------------------------------------

Add-LogLine 'Ready. Preview mode is on - press Run optimization to see what would change, without changing anything.' 'Info'
Add-LogLine "Logs and undo files are kept in $($script:Ctx.DataDir)" 'Info'

Show-UndoLogs

$null = $script:Window.ShowDialog()
