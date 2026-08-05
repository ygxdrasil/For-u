<#
    Services.psm1 - trim background services that cost RAM and CPU for no benefit.

    Two hard rules:
      1. Only services on the curated list below are ever touched.
      2. The developer whitelist wins over everything. WSL, Docker, Hyper-V, SSH
         and the VM platform are never disabled, no matter what else matches.

    Preference is 'Manual' over 'Disabled' wherever Manual is sufficient, so a
    service that turns out to be needed can still start on demand.
#>

Set-StrictMode -Version 2.0

# Never touched. The user does development work on this machine.
$script:DevWhitelist = @(
    'LxssManager', 'WSLService', 'vmcompute', 'vmms', 'HvHost',
    'com.docker.service', 'docker', 'dockerd',
    'ssh-agent', 'sshd',
    'VBoxDrv', 'VBoxNetAdp', 'VMwareHostd', 'VMAuthdService',
    'MSSQL', 'MySQL', 'postgresql', 'Redis', 'nginx', 'Apache',
    'WinDefend', 'SecurityHealthService', 'wscsvc', 'mpssvc',
    'wuauserv', 'BITS', 'CryptSvc', 'TrustedInstaller', 'AudioSrv', 'Audiosrv',
    'WSearch'   # search is genuinely useful for school and work files
)

<#
    The curated list. 'Target' is the start type we move to.
    Nothing here affects networking, audio, input, security or updates.
#>
$script:ServiceCatalog = @(
    @{ Name = 'DiagTrack'
       Label = 'Connected User Experiences and Telemetry'
       Target = 'Disabled'
       Why = 'Sends usage telemetry to Microsoft. Runs constantly and touches the disk. Nothing on the machine depends on it.' },

    @{ Name = 'dmwappushservice'
       Label = 'WAP Push Message Routing'
       Target = 'Disabled'
       Why = 'Device-management message routing, used only by enterprise MDM. Unused on a personal laptop.' },

    @{ Name = 'diagnosticshub.standardcollector.service'
       Label = 'Diagnostics Hub Collector'
       Target = 'Manual'
       Why = 'Collects performance traces for developer tooling. Starts on demand when actually needed.' },

    @{ Name = 'RetailDemo'
       Label = 'Retail Demo Service'
       Target = 'Disabled'
       Why = 'Drives the in-store demo mode this laptop shipped with. Useless outside a shop floor.' },

    @{ Name = 'MapsBroker'
       Label = 'Downloaded Maps Manager'
       Target = 'Disabled'
       Why = 'Background download for offline maps. Only matters if you use the Maps app offline.' },

    @{ Name = 'Fax'
       Label = 'Fax'
       Target = 'Disabled'
       Why = 'Fax support.' },

    @{ Name = 'RemoteRegistry'
       Label = 'Remote Registry'
       Target = 'Disabled'
       Why = 'Lets other machines edit this one''s registry over the network. Already disabled by default on most builds; closing it is good hygiene.' },

    @{ Name = 'RemoteAccess'
       Label = 'Routing and Remote Access'
       Target = 'Disabled'
       Why = 'Turns the laptop into a router or VPN server. Not something a laptop needs.' },

    @{ Name = 'WMPNetworkSvc'
       Label = 'Windows Media Player Network Sharing'
       Target = 'Disabled'
       Why = 'Streams your media library to other devices on the network.' },

    @{ Name = 'XblAuthManager'
       Label = 'Xbox Live Auth Manager'
       Target = 'Manual'
       Why = 'Xbox sign-in. Set to Manual so it still works if you ever launch a game.' },

    @{ Name = 'XblGameSave'
       Label = 'Xbox Live Game Save'
       Target = 'Manual'
       Why = 'Xbox cloud saves. Manual, not disabled.' },

    @{ Name = 'XboxNetApiSvc'
       Label = 'Xbox Live Networking'
       Target = 'Manual'
       Why = 'Xbox multiplayer networking. Manual, not disabled.' },

    @{ Name = 'XboxGipSvc'
       Label = 'Xbox Accessory Management'
       Target = 'Manual'
       Why = 'Xbox controller support. Manual so a controller still works when plugged in.' },

    @{ Name = 'wisvc'
       Label = 'Windows Insider Service'
       Target = 'Disabled'
       Why = 'Only used by machines enrolled in the Windows Insider preview programme.' },

    @{ Name = 'PcaSvc'
       Label = 'Program Compatibility Assistant'
       Target = 'Manual'
       Why = 'Watches every program you launch for compatibility problems. Manual is sufficient.' },

    @{ Name = 'SysMain'
       Label = 'SysMain (Superfetch)'
       Target = 'Disabled'
       Why = 'Preloads apps into RAM by predicting what you will open. Designed for spinning hard drives; on an NVMe SSD it mostly generates background disk activity.' },

    @{ Name = 'HPAppHelperCap'
       Label = 'HP App Helper'
       Target = 'Manual'
       Why = 'HP helper agent for preinstalled HP apps. Not a driver.' },

    @{ Name = 'HPDiagsCap'
       Label = 'HP Diagnostics'
       Target = 'Manual'
       Why = 'HP diagnostics collector. The HP diagnostics app still runs when you open it.' },

    @{ Name = 'HPSysInfoCap'
       Label = 'HP System Info'
       Target = 'Manual'
       Why = 'Feeds system info to HP support software.' },

    @{ Name = 'HpTouchpointAnalyticsService'
       Label = 'HP Analytics'
       Target = 'Disabled'
       Why = 'HP telemetry collection. Purely for HP''s analytics, not for the machine.' }
)

function Get-ServiceStartMode {
    <#  Returns Automatic / Manual / Disabled / $null if the service is absent.  #>
    param([Parameter(Mandatory)][string]$Name)
    try {
        $svc = Get-CimInstance Win32_Service -Filter "Name='$Name'" -ErrorAction Stop
        if (-not $svc) { return $null }
        switch ($svc.StartMode) {
            'Auto'     { return 'Automatic' }
            'Manual'   { return 'Manual' }
            'Disabled' { return 'Disabled' }
            default    { return "$($svc.StartMode)" }
        }
    } catch {
        return $null
    }
}

function Set-ServiceStartType {
    <#
        Set-Service is the clean path, but some services (DiagTrack in
        particular) are ACL-protected against it. sc.exe is the fallback.
        Also used by the undo replayer.
    #>
    param(
        [Parameter(Mandatory)][string]$Name,
        [Parameter(Mandatory)][ValidateSet('Automatic', 'Manual', 'Disabled')][string]$StartType
    )

    try {
        Set-Service -Name $Name -StartupType $StartType -ErrorAction Stop
    } catch {
        $scArg = switch ($StartType) {
            'Automatic' { 'auto' }
            'Manual'    { 'demand' }
            'Disabled'  { 'disabled' }
        }
        $output = & sc.exe config $Name start= $scArg 2>&1
        if ($LASTEXITCODE -ne 0) {
            throw "sc.exe could not change '$Name': $output"
        }
    }

    if ($StartType -eq 'Disabled') {
        # Stop it now rather than waiting for the next boot.
        try { Stop-Service -Name $Name -Force -ErrorAction SilentlyContinue } catch { }
    }
}

function Test-DevWhitelisted {
    param([string]$Name)
    foreach ($w in $script:DevWhitelist) {
        if ($Name -like "*$w*") { return $true }
    }
    return $false
}

function Get-ServicePlan {
    <#
        What the trim would do, without doing it. The UI uses this for the
        details view and the dry-run preview.
    #>
    $plan = @()
    foreach ($entry in $script:ServiceCatalog) {

        if (Test-DevWhitelisted $entry.Name) { continue }

        $current = Get-ServiceStartMode -Name $entry.Name
        if ($null -eq $current) { continue }                 # not installed
        if ($current -eq $entry.Target) { continue }         # already there
        if ($current -eq 'Disabled') { continue }            # never re-enable something already off

        $plan += [pscustomobject]@{
            Name    = $entry.Name
            Label   = $entry.Label
            Current = $current
            Target  = $entry.Target
            Why     = $entry.Why
        }
    }
    return @($plan)
}

function Invoke-ServiceTrim {
    $ctx = Get-OptContext
    Write-OptLog 'Reviewing background services...' 'Info'

    $plan = Get-ServicePlan
    if ($plan.Count -eq 0) {
        Write-OptLog 'No services need changing - nothing on the curated list is running unnecessarily.' 'Finding'
        return 0
    }

    Write-OptLog "$($plan.Count) services can be trimmed. WSL, Docker, Hyper-V, SSH, databases and Windows Search are whitelisted and will not be touched." 'Finding'

    $changed = 0
    foreach ($p in $plan) {
        $name    = $p.Name
        $target  = $p.Target
        $current = $p.Current

        $action = { Set-ServiceStartType -Name $name -StartType $target }.GetNewClosure()

        $ok = Invoke-Guarded `
            -Description "Set '$($p.Label)' to $target (was $current) - $($p.Why)" `
            -UndoType 'Service' `
            -UndoData @{ Name = $name; OldStartType = $current } `
            -Action $action

        if ($ok) { $changed++ }
    }

    $ctx.Stats.ServicesChanged += $changed
    return $changed
}

Export-ModuleMember -Function Get-ServiceStartMode, Set-ServiceStartType, Get-ServicePlan,
    Invoke-ServiceTrim, Test-DevWhitelisted
