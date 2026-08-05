<#
    Bloatware.psm1 - find preinstalled software, describe it honestly, remove
    only what the user ticks.

    This is the one module that never acts automatically. Uninstalls are the
    only irreversible thing the tool does, so every one of them is a decision
    the user makes with the description in front of them.

    Recommendation levels:
      Remove  - safe to remove, no downside worth mentioning
      Keep    - detected as "bloat" by most lists, but genuinely useful here
      Ask     - depends entirely on whether you use it
#>

Set-StrictMode -Version 2.0

# Store apps. Key is the package family prefix.
$script:AppxCatalog = @(
    @{ Id = 'Microsoft.549981C3F5F10';        Label = 'Cortana';                   Rec = 'Remove'; Why = 'The old Cortana assistant. Superseded and unused.' },
    @{ Id = 'Microsoft.BingNews';             Label = 'Microsoft News';            Rec = 'Remove'; Why = 'News feed app. Also feeds the widgets panel.' },
    @{ Id = 'Microsoft.BingWeather';          Label = 'Weather';                   Rec = 'Ask';    Why = 'Small, but it does poll in the background.' },
    @{ Id = 'Microsoft.BingSearch';           Label = 'Web Search from Bing';      Rec = 'Ask';    Why = 'Puts Bing results in the Start menu search box.' },
    @{ Id = 'Microsoft.GetHelp';              Label = 'Get Help';                  Rec = 'Remove'; Why = 'Support chat app. The web version is the same thing.' },
    @{ Id = 'Microsoft.Getstarted';           Label = 'Tips';                      Rec = 'Remove'; Why = 'Windows tips and tricks tour.' },
    @{ Id = 'Microsoft.MicrosoftSolitaireCollection'; Label = 'Solitaire Collection'; Rec = 'Ask'; Why = 'Includes ads and runs a background service. Remove unless you play it.' },
    @{ Id = 'Microsoft.People';               Label = 'People';                    Rec = 'Remove'; Why = 'Contacts app almost nothing uses.' },
    @{ Id = 'Microsoft.WindowsFeedbackHub';   Label = 'Feedback Hub';              Rec = 'Remove'; Why = 'For sending feedback to Microsoft.' },
    @{ Id = 'Microsoft.WindowsMaps';          Label = 'Maps';                      Rec = 'Remove'; Why = 'Offline maps app. Pairs with the Downloaded Maps Manager service.' },
    @{ Id = 'Microsoft.MixedReality.Portal';  Label = 'Mixed Reality Portal';      Rec = 'Remove'; Why = 'For VR headsets. Discontinued.' },
    @{ Id = 'Microsoft.Microsoft3DViewer';    Label = '3D Viewer';                 Rec = 'Remove'; Why = 'Discontinued 3D model viewer.' },
    @{ Id = 'Microsoft.Print3D';              Label = 'Print 3D';                  Rec = 'Remove'; Why = 'Discontinued 3D printing app.' },
    @{ Id = 'Microsoft.SkypeApp';             Label = 'Skype';                     Rec = 'Ask';    Why = 'Preinstalled Skype. Remove unless you use it.' },
    @{ Id = 'Microsoft.OneConnect';           Label = 'Mobile Plans';              Rec = 'Remove'; Why = 'For cellular data plans. This laptop has no SIM.' },
    @{ Id = 'Microsoft.MicrosoftOfficeHub';   Label = 'Office hub app';            Rec = 'Ask';    Why = 'A launcher and upsell page for Microsoft 365. Not Office itself - removing it does not remove Word or Excel.' },
    @{ Id = 'Microsoft.ZuneMusic';            Label = 'Media Player';              Rec = 'Ask';    Why = 'The Windows media player. You do media work, so this may be worth keeping.' },
    @{ Id = 'Microsoft.ZuneVideo';            Label = 'Movies & TV';               Rec = 'Ask';    Why = 'Video playback and the Microsoft video store.' },
    @{ Id = 'Clipchamp.Clipchamp';            Label = 'Clipchamp video editor';    Rec = 'Keep';   Why = 'Microsoft''s built-in video editor. You said you do video work - this is the free tool for it. Most bloat lists strip it; here it is probably worth keeping.' },
    @{ Id = 'Microsoft.YourPhone';            Label = 'Phone Link';                Rec = 'Keep';   Why = 'Links your phone for texts and notifications. Genuinely useful if you use it, harmless if you do not.' },
    @{ Id = 'Microsoft.MicrosoftStickyNotes'; Label = 'Sticky Notes';              Rec = 'Keep';   Why = 'Small and useful for school notes.' },
    @{ Id = 'Microsoft.Todos';                Label = 'Microsoft To Do';           Rec = 'Ask';    Why = 'Microsoft''s task and reminder list. Small, but it syncs in the background. Remove it unless you actually use it for school work.' },
    @{ Id = 'Microsoft.XboxApp';              Label = 'Xbox';                      Rec = 'Remove'; Why = 'Xbox social app. You said you do not game.' },
    @{ Id = 'Microsoft.XboxGamingOverlay';    Label = 'Xbox Game Bar';             Rec = 'Ask';    Why = 'The Win+G overlay. It also provides screen recording, which is occasionally handy.' },
    @{ Id = 'Microsoft.XboxGameOverlay';      Label = 'Xbox Game Overlay';         Rec = 'Remove'; Why = 'Legacy overlay component.' },
    @{ Id = 'Microsoft.Xbox.TCUI';            Label = 'Xbox TCUI';                 Rec = 'Ask';    Why = 'Shared Xbox UI component. Some non-Xbox games reference it.' },
    @{ Id = 'Microsoft.XboxSpeechToTextOverlay'; Label = 'Xbox speech overlay';    Rec = 'Remove'; Why = 'Game chat transcription.' },
    @{ Id = 'MicrosoftTeams';                 Label = 'Teams (personal)';          Rec = 'Ask';    Why = 'The consumer Teams chat app, separate from Teams for work.' },
    @{ Id = 'MSTeams';                        Label = 'Microsoft Teams';           Rec = 'Ask';    Why = 'Remove only if you do not use Teams for school or work.' },
    @{ Id = 'SpotifyAB.SpotifyMusic';         Label = 'Spotify (preinstalled)';    Rec = 'Ask';    Why = 'Preinstalled Spotify stub.' },
    @{ Id = 'king.com.';                      Label = 'Candy Crush';               Rec = 'Remove'; Why = 'Preinstalled game that Windows installs on its own. It shows ads and launches a background process.' },
    @{ Id = 'Disney';                         Label = 'Disney+';                   Rec = 'Remove'; Why = 'Preinstalled advertising stub.' },
    @{ Id = 'Netflix';                        Label = 'Netflix';                   Rec = 'Ask';    Why = 'Preinstalled stub. The website works the same.' },
    @{ Id = 'Amazon.com.Amazon';              Label = 'Amazon';                    Rec = 'Remove'; Why = 'Preinstalled shopping stub.' },
    @{ Id = 'BytedancePte.Ltd.TikTok';        Label = 'TikTok';                    Rec = 'Remove'; Why = 'A preinstalled shortcut that downloads the real app on first launch. The website works the same.' },
    @{ Id = 'Facebook';                       Label = 'Facebook / Instagram';      Rec = 'Remove'; Why = 'A preinstalled shortcut that downloads the real app on first launch. The website works the same.' },
    @{ Id = 'AD2F1837.HPJumpStarts';          Label = 'HP JumpStarts';             Rec = 'Remove'; Why = 'HP promotional content.' },
    @{ Id = 'AD2F1837.HPRegistration';        Label = 'HP Registration';           Rec = 'Remove'; Why = 'One-time product registration nag.' },
    @{ Id = 'AD2F1837.HPPrivacySettings';     Label = 'HP Privacy Settings';       Rec = 'Remove'; Why = 'Configures HP telemetry that you are about to turn off anyway.' },
    @{ Id = 'AD2F1837.HPQuickDrop';           Label = 'HP QuickDrop';              Rec = 'Ask';    Why = 'File transfer between the laptop and a phone. Useful only if you use it.' },
    @{ Id = 'AD2F1837.HPWorkWell';            Label = 'HP Work Well';              Rec = 'Remove'; Why = 'Posture and break reminders.' },
    @{ Id = 'AD2F1837.HPEasyClean';           Label = 'HP Easy Clean';             Rec = 'Remove'; Why = 'Locks the keyboard so you can wipe it. An app for that.' },
    @{ Id = 'AD2F1837.myHP';                  Label = 'myHP';                      Rec = 'Ask';    Why = 'HP dashboard and upsell surface. It does surface driver updates.' },
    @{ Id = 'AD2F1837.HPSupportAssistant';    Label = 'HP Support Assistant';      Rec = 'Ask';    Why = 'Heavy, but it is also how HP ships BIOS and driver updates. Keeping it is defensible; if you remove it, get updates from HP''s website instead.' },
    @{ Id = 'AD2F1837.HPDesktopSupportUtilities'; Label = 'HP Desktop Support Utilities'; Rec = 'Remove'; Why = 'Support helper utilities.' },
    @{ Id = 'AD2F1837.HPPowerManager';        Label = 'HP Power Manager';          Rec = 'Ask';    Why = 'Overlaps with the Windows power settings this tool tunes.' },
    @{ Id = 'AD2F1837.HPSystemInformation';   Label = 'HP System Information';     Rec = 'Remove'; Why = 'Shows the laptop''s specifications. Windows already reports all of this in Settings > System > About.' },
    @{ Id = 'AD2F1837.HPPrinterControl';      Label = 'HP Printer Control';        Rec = 'Ask';    Why = 'Only needed if you own an HP printer.' },
    @{ Id = 'AD2F1837.HPAudioCenter';         Label = 'HP Audio Center';           Rec = 'Keep';   Why = 'Audio tuning tied to the speaker hardware. Removing it can leave your speakers sounding flat.' },
    @{ Id = 'AD2F1837.HPCommandCenter';       Label = 'HP Command Center';         Rec = 'Keep';   Why = 'Controls fan and thermal profiles on HP laptops. Given you mentioned heat and fan noise, keep this - it is the tool that manages them.' },
    @{ Id = 'AD2F1837.HPProgrammableKey';     Label = 'HP Programmable Key';       Rec = 'Ask';    Why = 'Handles the programmable key if your keyboard has one.' },
    @{ Id = 'AD2F1837.HPPCHardwareDiagnosticsWindows'; Label = 'HP PC Hardware Diagnostics'; Rec = 'Keep'; Why = 'Hardware self-test tool. Small, and worth having if the machine ever misbehaves under warranty.' }
)

# Classic desktop installers, matched by display name.
$script:Win32Catalog = @(
    @{ Match = 'McAfee';        Label = 'McAfee';              Rec = 'Remove'; Why = 'Trial antivirus. Runs constantly, hooks file and network activity, and nags for payment. Windows Defender is already active and does not cost performance in the same way. This is the most common cause of a new HP laptop feeling slow.' },
    @{ Match = 'Norton';        Label = 'Norton';              Rec = 'Remove'; Why = 'Trial antivirus with the same problems as McAfee.' },
    @{ Match = 'HP Wolf Security'; Label = 'HP Wolf Security'; Rec = 'Ask';    Why = 'HP''s security layer. It is a real product, but it is heavy - it virtualises browser tabs and file opens, which is exactly what makes a machine feel sluggish everywhere. Remove it if you want speed; keep it if you specifically want the isolation.' },
    @{ Match = 'HP Sure';       Label = 'HP Sure Click / Sure Sense'; Rec = 'Ask'; Why = 'Part of the HP Wolf Security family. Same trade-off.' },
    @{ Match = 'ExpressVPN';    Label = 'ExpressVPN trial';    Rec = 'Remove'; Why = 'Preinstalled VPN trial.' },
    @{ Match = 'Booking.com';   Label = 'Booking.com';         Rec = 'Remove'; Why = 'Preinstalled advertising.' },
    @{ Match = 'WildTangent';   Label = 'WildTangent Games';   Rec = 'Remove'; Why = 'Preinstalled game portal.' },
    @{ Match = 'Dropbox Promo'; Label = 'Dropbox promotion';   Rec = 'Remove'; Why = 'Preinstalled storage promotion.' }
)

function Get-InstalledWin32App {
    <#  Desktop apps from both registry views plus the per-user hive.  #>
    $keys = @(
        'HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\*',
        'HKLM:\SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall\*',
        'HKCU:\SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\*'
    )

    $apps = @()
    foreach ($k in $keys) {
        try {
            foreach ($item in (Get-ItemProperty -Path $k -ErrorAction SilentlyContinue)) {
                $name = $null
                try { $name = $item.DisplayName } catch { }
                if ([string]::IsNullOrWhiteSpace($name)) { continue }

                $uninstall = $null
                $quiet = $null
                try { $uninstall = $item.UninstallString } catch { }
                try { $quiet = $item.QuietUninstallString } catch { }

                $apps += [pscustomobject]@{
                    Name             = $name
                    Publisher        = $(try { $item.Publisher } catch { $null })
                    UninstallString  = $uninstall
                    QuietUninstall   = $quiet
                    RegistryKey      = $item.PSPath
                }
            }
        } catch { }
    }

    return @($apps | Sort-Object Name -Unique)
}

function Get-BloatwareCandidates {
    <#
        Everything on the catalogue that is actually installed, each with a
        recommendation and a plain-English explanation.
    #>
    $found = @()

    # --- Store apps --------------------------------------------------------
    $installedAppx = @()
    try {
        $installedAppx = @(Get-AppxPackage -ErrorAction SilentlyContinue)
    } catch { }

    foreach ($entry in $script:AppxCatalog) {
        $match = $installedAppx | Where-Object { $_.Name -like "$($entry.Id)*" } | Select-Object -First 1
        if (-not $match) { continue }

        $found += [pscustomobject]@{
            Label          = $entry.Label
            Identifier     = $match.PackageFullName
            PackageName    = $match.Name
            Kind           = 'Appx'
            Recommendation = $entry.Rec
            Why            = $entry.Why
            Selected       = ($entry.Rec -eq 'Remove')
        }
    }

    # --- Desktop apps ------------------------------------------------------
    $installedWin32 = Get-InstalledWin32App
    foreach ($entry in $script:Win32Catalog) {
        foreach ($app in ($installedWin32 | Where-Object { $_.Name -like "*$($entry.Match)*" })) {
            $found += [pscustomobject]@{
                Label          = "$($app.Name)"
                Identifier     = $app.QuietUninstall
                PackageName    = $app.Name
                Kind           = 'Win32'
                Recommendation = $entry.Rec
                Why            = $entry.Why
                Selected       = ($entry.Rec -eq 'Remove')
                UninstallString = $app.UninstallString
                QuietUninstall  = $app.QuietUninstall
            }
        }
    }

    $order = @{ 'Remove' = 0; 'Ask' = 1; 'Keep' = 2 }
    return @($found | Sort-Object { $order["$($_.Recommendation)"] }, Label)
}

function Remove-BloatwareItem {
    param([Parameter(Mandatory)]$Item)

    if ($Item.Kind -eq 'Appx') {
        $pkg = $Item.Identifier
        $name = $Item.PackageName
        $action = {
            Get-AppxPackage -Name $name -ErrorAction SilentlyContinue |
                Remove-AppxPackage -ErrorAction Stop

            # Also drop the provisioned copy so it does not return for new users.
            Get-AppxProvisionedPackage -Online -ErrorAction SilentlyContinue |
                Where-Object { $_.DisplayName -like "$name*" } |
                ForEach-Object {
                    Remove-AppxProvisionedPackage -Online -PackageName $_.PackageName -ErrorAction SilentlyContinue | Out-Null
                }
        }.GetNewClosure()

        return Invoke-Guarded `
            -Description "Removed '$($Item.Label)'" `
            -UndoType 'AppRemoved' `
            -UndoData @{ Name = $Item.Label; Package = $pkg } `
            -Action $action
    }

    if ($Item.Kind -eq 'Win32') {
        $label = $Item.Label
        $quiet = $Item.QuietUninstall
        $plain = $Item.UninstallString

        <#
            Three routes, best first. Plenty of preinstalled software - McAfee
            especially - registers no quiet uninstall string at all, so falling
            back to the visible uninstaller is the difference between removing
            it and telling the user to go and do it themselves.
        #>
        $command = $null
        $silent  = $true

        if (-not [string]::IsNullOrWhiteSpace($quiet)) {
            $command = $quiet
        }
        elseif ($plain -match 'MsiExec(\.exe)?"?\s*/[IXix]\s*(\{[0-9A-Fa-f\-]+\})') {
            # An MSI product. /X is the uninstall verb; /qn runs it without a UI.
            $command = "MsiExec.exe /X$($Matches[2]) /qn /norestart"
        }
        elseif (-not [string]::IsNullOrWhiteSpace($plain)) {
            $command = $plain
            $silent  = $false
        }
        else {
            Write-OptLog "'$label' registers no uninstaller this tool can call. Remove it from Settings > Apps > Installed apps." 'Warn'
            return $false
        }

        # Shown so preview mode tells you exactly what would be run, not just that
        # something would be.
        Write-OptLog "Uninstall command for '$label': $command" 'Info'

        if (-not $silent) {
            Write-OptLog "'$label' has no silent uninstaller, so its own uninstall window will open. Follow its prompts - this app waits until you have finished." 'Warn'
        }

        $showWindow = -not $silent

        $action = {
            $exe = $command
            $arguments = ''
            if ($command -match '^"([^"]+)"\s*(.*)$') {
                $exe = $Matches[1]
                $arguments = $Matches[2]
            } elseif ($command -match '^(\S+\.exe)\s*(.*)$') {
                $exe = $Matches[1]
                $arguments = $Matches[2]
            }

            $params = @{ FilePath = $exe; Wait = $true; ErrorAction = 'Stop' }
            if (-not [string]::IsNullOrWhiteSpace($arguments)) { $params.ArgumentList = $arguments }
            if (-not $showWindow) { $params.NoNewWindow = $true }

            Start-Process @params
        }.GetNewClosure()

        return Invoke-Guarded `
            -Description "Uninstalled '$label'" `
            -UndoType 'AppRemoved' `
            -UndoData @{ Name = $label } `
            -Action $action
    }

    return $false
}

function Invoke-BloatwareRemoval {
    <#  Only ever removes what was explicitly selected in the UI.  #>
    param([Parameter(Mandatory)][array]$Items)

    $ctx = Get-OptContext
    $selected = @($Items | Where-Object { $_.Selected })

    if ($selected.Count -eq 0) {
        Write-OptLog 'No preinstalled software selected for removal.' 'Info'
        return 0
    }

    Write-OptLog "Removing $($selected.Count) selected app(s). This is the one part that cannot be undone automatically." 'Info'

    $removed = 0
    foreach ($item in $selected) {
        if (Remove-BloatwareItem -Item $item) { $removed++ }
    }

    $ctx.Stats.AppsRemoved += $removed
    return $removed
}

Export-ModuleMember -Function Get-InstalledWin32App, Get-BloatwareCandidates,
    Remove-BloatwareItem, Invoke-BloatwareRemoval
