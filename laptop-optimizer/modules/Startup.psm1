<#
    Startup.psm1 - what launches at login, and how to stop the junk.

    Disabling is done the way Task Manager does it: through the StartupApproved
    registry values, and Disable-ScheduledTask for tasks. The original Run entry
    is never deleted, so re-enabling is exact and lossless.
#>

Set-StrictMode -Version 2.0

# Run keys paired with the StartupApproved key that controls them.
$script:RunLocations = @(
    @{ Run = 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Run'
       Approved = 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Explorer\StartupApproved\Run'
       Scope = 'Current user' },
    @{ Run = 'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Run'
       Approved = 'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\StartupApproved\Run'
       Scope = 'All users' },
    @{ Run = 'HKLM:\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Run'
       Approved = 'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\StartupApproved\Run32'
       Scope = 'All users (32-bit)' }
)

# Never touched, whatever else matches. Drivers, input, audio, security, and
# the development toolchain the user asked to keep working.
$script:ProtectedPatterns = @(
    'RtkAudUService', 'RtkNGUI', 'Realtek', 'Waves', 'Nahimic', 'SmartAudio',
    'SynTP', 'Synaptics', 'ETDCtrl', 'Elan', 'Touchpad',
    'igfx', 'AMD', 'RadeonSoftware', 'atieclxx', 'NVIDIA', 'nvcontainer',
    'SecurityHealth', 'Windows Defender', 'MsMpEng', 'Sense',
    'HotKey', 'HPSystemEventUtility', 'HP System Event',
    'Docker', 'wsl', 'vmmem', 'VBoxTray', 'vmware',
    'ssh-agent', 'GitHub', 'gpg-agent', 'kubectl',
    'OneDrive'   # school and work files live here - never silently disable it
)

# Known safe to disable at login. Each entry explains itself in the UI.
$script:JunkPatterns = @(
    @{ Match = 'AdobeAAMUpdater';   Why = 'Adobe updater. Adobe apps check for updates when you open them.' },
    @{ Match = 'Adobe Updater';     Why = 'Adobe updater. Runs at every login for no benefit.' },
    @{ Match = 'AcroTray';          Why = 'Acrobat background helper. Acrobat works fine without it.' },
    @{ Match = 'iTunesHelper';      Why = 'iTunes device watcher. iTunes starts fine without it.' },
    @{ Match = 'QuickTime';         Why = 'Discontinued software launching at boot.' },
    @{ Match = 'Spotify';           Why = 'Spotify auto-launch. Open it when you want it.' },
    @{ Match = 'Steam';             Why = 'Steam auto-launch. Launch it when you play.' },
    @{ Match = 'EpicGames';         Why = 'Epic launcher auto-start.' },
    @{ Match = 'Discord';           Why = 'Discord auto-launch. Notable memory user at idle.' },
    @{ Match = 'Skype';             Why = 'Skype auto-launch.' },
    @{ Match = 'Zoom';              Why = 'Zoom auto-start. Meeting links launch it on demand.' },
    @{ Match = 'CCleaner';          Why = 'Third-party cleaner running in the background.' },
    @{ Match = 'GoogleDriveFS';     Why = 'Google Drive sync at login - only if you do not rely on it.' },
    @{ Match = 'GoogleChromeAutoLaunch'; Why = 'Chrome background launcher.' },
    # Deliberately not a bare 'Update' - that matches any path containing the
    # word and would sweep up things it should not.
    @{ Match = 'Updater';           Why = 'A background updater. It checks for updates you can trigger manually from inside the app.' },
    @{ Match = 'AutoUpdate';        Why = 'A background auto-updater.' },
    @{ Match = 'UpdateChecker';     Why = 'A background update checker.' },
    @{ Match = 'SoftwareUpdate';    Why = 'A background update checker.' },
    @{ Match = 'HPJumpStart';       Why = 'HP promotional software.' },
    @{ Match = 'HP Registration';   Why = 'One-time HP registration nag.' },
    @{ Match = 'HPSupportAssistant'; Why = 'HP Support Assistant background agent. The app still opens manually.' },
    @{ Match = 'HPWelcome';         Why = 'HP welcome screen.' },
    @{ Match = 'McAfee';            Why = 'McAfee component. Better removed entirely on the Bloatware tab.' },
    @{ Match = 'Norton';            Why = 'Norton component. Better removed entirely on the Bloatware tab.' },
    @{ Match = 'Booking.com';       Why = 'Preinstalled advertising.' },
    @{ Match = 'ExpressVPN';        Why = 'Preinstalled VPN trial.' }
)

function Test-Protected {
    param([string]$Text)
    if ([string]::IsNullOrWhiteSpace($Text)) { return $false }
    foreach ($p in $script:ProtectedPatterns) {
        if ($Text -like "*$p*") { return $true }
    }
    return $false
}

function Get-JunkReason {
    <#  Returns the explanation if this entry is on the junk list, else $null.  #>
    param([string]$Name, [string]$Command)
    $haystack = "$Name $Command"
    if (Test-Protected $haystack) { return $null }
    foreach ($j in $script:JunkPatterns) {
        if ($haystack -like "*$($j.Match)*") { return $j.Why }
    }
    return $null
}

function Get-StartupApprovedState {
    <#  $true = enabled, $false = disabled. Absent value means enabled.  #>
    param([string]$ApprovedKey, [string]$ValueName)
    try {
        if (-not (Test-Path $ApprovedKey)) { return $true }
        $item = Get-ItemProperty -Path $ApprovedKey -Name $ValueName -ErrorAction SilentlyContinue
        if (-not $item) { return $true }
        $bytes = $item.$ValueName
        if (-not $bytes -or $bytes.Length -lt 1) { return $true }
        # Byte 0: 02/06 = enabled, 03/07 = disabled.
        return -not (($bytes[0] -band 0x01) -eq 1)
    } catch {
        return $true
    }
}

function Set-StartupApprovedState {
    <#
        Flips an entry between enabled and disabled using the same mechanism
        Task Manager uses. Also called by the undo replayer.
    #>
    param(
        [Parameter(Mandatory)][string]$HivePath,
        [Parameter(Mandatory)][string]$ValueName,
        [Parameter(Mandatory)][bool]$Enabled
    )

    if (-not (Test-Path $HivePath)) {
        New-Item -Path $HivePath -Force -ErrorAction Stop | Out-Null
    }

    if ($Enabled) {
        $bytes = [byte[]](0x02, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
    } else {
        $stamp = [byte[]][BitConverter]::GetBytes((Get-Date).ToFileTime())
        $bytes = [byte[]](@(0x03, 0, 0, 0) + $stamp)
    }

    Set-ItemProperty -Path $HivePath -Name $ValueName -Value $bytes -Type Binary -ErrorAction Stop
}

function Get-StartupFolders {
    @(
        @{ Path = [Environment]::GetFolderPath('Startup');       Scope = 'Current user' },
        @{ Path = [Environment]::GetFolderPath('CommonStartup'); Scope = 'All users' }
    )
}

function Get-StartupItems {
    <#
        Every autostart entry we know how to control, with its current state
        and whether it is on the junk list.
    #>
    $items = @()

    foreach ($loc in $script:RunLocations) {
        if (-not (Test-Path $loc.Run)) { continue }
        try {
            $props = Get-ItemProperty -Path $loc.Run -ErrorAction Stop
        } catch { continue }

        foreach ($p in $props.PSObject.Properties) {
            if ($p.Name -like 'PS*') { continue }
            $command = "$($p.Value)"
            $enabled = Get-StartupApprovedState -ApprovedKey $loc.Approved -ValueName $p.Name

            $items += [pscustomobject]@{
                Name        = $p.Name
                Command     = $command
                Scope       = $loc.Scope
                Kind        = 'Registry'
                Enabled     = $enabled
                ApprovedKey = $loc.Approved
                Identifier  = $p.Name
                JunkReason  = (Get-JunkReason -Name $p.Name -Command $command)
                Protected   = (Test-Protected "$($p.Name) $command")
            }
        }
    }

    foreach ($f in Get-StartupFolders) {
        if (-not $f.Path -or -not (Test-Path $f.Path)) { continue }
        foreach ($file in (Get-ChildItem -Path $f.Path -File -ErrorAction SilentlyContinue)) {
            if ($file.Extension -eq '.ini') { continue }
            $isDisabled = $file.Extension -eq '.disabled'
            $displayName = if ($isDisabled) { $file.BaseName } else { $file.Name }

            $items += [pscustomobject]@{
                Name        = $displayName
                Command     = $file.FullName
                Scope       = $f.Scope
                Kind        = 'StartupFolder'
                Enabled     = -not $isDisabled
                ApprovedKey = $null
                Identifier  = $file.FullName
                JunkReason  = (Get-JunkReason -Name $displayName -Command $file.FullName)
                Protected   = (Test-Protected "$displayName $($file.FullName)")
            }
        }
    }

    # Logon-triggered scheduled tasks, excluding everything Windows owns.
    try {
        foreach ($task in (Get-ScheduledTask -ErrorAction Stop)) {
            if ($task.TaskPath -like '\Microsoft\*') { continue }
            if ($task.State -eq 'Disabled') { $enabled = $false } else { $enabled = $true }

            $hasLogonTrigger = $false
            try {
                foreach ($t in @($task.Triggers)) {
                    if ($t -and $t.CimClass -and "$($t.CimClass.CimClassName)" -match 'Logon|Boot') {
                        $hasLogonTrigger = $true
                    }
                }
            } catch { }
            if (-not $hasLogonTrigger) { continue }

            $items += [pscustomobject]@{
                Name        = $task.TaskName
                Command     = "Scheduled task $($task.TaskPath)$($task.TaskName)"
                Scope       = 'Scheduled task'
                Kind        = 'ScheduledTask'
                Enabled     = $enabled
                ApprovedKey = $null
                Identifier  = "$($task.TaskPath)|$($task.TaskName)"
                JunkReason  = (Get-JunkReason -Name $task.TaskName -Command $task.TaskPath)
                Protected   = (Test-Protected "$($task.TaskName) $($task.TaskPath)")
            }
        }
    } catch { }

    return @($items)
}

function Disable-StartupItem {
    param([Parameter(Mandatory)]$Item)

    if ($Item.Protected) {
        Write-OptLog "Skipped '$($Item.Name)' - on the protected list." 'Info'
        return $false
    }
    if (-not $Item.Enabled) { return $false }

    # Each action is closed over its local variables with GetNewClosure(), because
    # Invoke-Guarded lives in a different module and would not otherwise see them.
    switch ($Item.Kind) {

        'Registry' {
            $key  = $Item.ApprovedKey
            $name = $Item.Identifier
            $action = { Set-StartupApprovedState -HivePath $key -ValueName $name -Enabled $false }.GetNewClosure()

            return Invoke-Guarded `
                -Description "Disabled startup item '$($Item.Name)'" `
                -UndoType 'StartupApproved' `
                -UndoData @{ KeyPath = $key; ValueName = $name } `
                -Action $action
        }

        'StartupFolder' {
            $source = $Item.Identifier
            $target = "$source.disabled"
            $action = { Move-Item -Path $source -Destination $target -Force -ErrorAction Stop }.GetNewClosure()

            return Invoke-Guarded `
                -Description "Disabled startup shortcut '$($Item.Name)'" `
                -UndoType 'StartupShortcut' `
                -UndoData @{ OriginalPath = $source; DisabledPath = $target } `
                -Action $action
        }

        'ScheduledTask' {
            $parts    = $Item.Identifier -split '\|', 2
            $taskPath = $parts[0]
            $taskName = $parts[1]
            $action = { Disable-ScheduledTask -TaskPath $taskPath -TaskName $taskName -ErrorAction Stop | Out-Null }.GetNewClosure()

            return Invoke-Guarded `
                -Description "Disabled logon task '$($Item.Name)'" `
                -UndoType 'ScheduledTask' `
                -UndoData @{ TaskPath = $taskPath; TaskName = $taskName } `
                -Action $action
        }

        default { return $false }
    }
}

function Invoke-StartupOptimization {
    <#
        Balanced mode: disable only entries on the curated junk list. Anything
        unrecognised is left alone and reported, because guessing wrong here is
        how these tools break people's machines.
    #>
    $ctx = Get-OptContext
    Write-OptLog 'Checking what launches at login...' 'Info'

    $all = Get-StartupItems
    $enabled = @($all | Where-Object { $_.Enabled })
    $junk = @($enabled | Where-Object { $_.JunkReason -and -not $_.Protected })

    Write-OptLog "$($enabled.Count) startup entries are active; $($junk.Count) match the safe-to-disable list." 'Finding'

    $disabled = 0
    foreach ($item in $junk) {
        Write-OptLog "$($item.Name) - $($item.JunkReason)" 'Info'
        if (Disable-StartupItem -Item $item) { $disabled++ }
    }

    $ctx.Stats.StartupDisabled += $disabled

    $unknown = @($enabled | Where-Object { -not $_.JunkReason -and -not $_.Protected })
    if ($unknown.Count -gt 0) {
        Write-OptLog "Left $($unknown.Count) startup entries alone because they are not on the known-junk list. Review them in the Details tab if boot is still slow." 'Info'
    }

    return $disabled
}

Export-ModuleMember -Function Get-StartupItems, Disable-StartupItem, Invoke-StartupOptimization,
    Set-StartupApprovedState, Get-StartupApprovedState
