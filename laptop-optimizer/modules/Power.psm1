<#
    Power.psm1 - stop the laptop throttling itself.

    A Ryzen 5 7000 that feels slow is often just being held down by a power
    policy: the Power saver plan, a processor maximum below 100%, or a passive
    cooling policy that downclocks instead of spinning the fan.

    Everything here is reversible through powercfg, and the previous values are
    read and recorded before anything is written.
#>

Set-StrictMode -Version 2.0

$script:BalancedScheme = '381b4222-f694-41f0-9685-ff5bb260df2e'
$script:SubProcessor   = '54533251-82be-4824-96c1-47b60b740d00'

$script:Settings = @{
    ProcThrottleMax = 'bc5038f7-23e0-4960-96da-33abaf5935ec'
    ProcThrottleMin = '893dee8e-2bef-41e0-89c6-b55d0929964c'
    SystemCooling   = '94d3a615-a899-4ac5-ae2b-e4d8f634367f'
}

function Get-ActivePowerScheme {
    try {
        $out = (& powercfg.exe /getactivescheme 2>&1) -join ' '
        if ($out -match '([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})') {
            $guid = $Matches[1]
            $name = 'Unknown'
            if ($out -match '\(([^)]+)\)') { $name = $Matches[1] }
            return [pscustomobject]@{ Guid = $guid; Name = $name }
        }
    } catch { }
    return $null
}

function Get-PowerValue {
    <#
        Reads the current AC and DC index for one setting.
        powercfg prints them as hex, e.g. 'Current AC Power Setting Index: 0x00000064'.
    #>
    param(
        [Parameter(Mandatory)][string]$Scheme,
        [Parameter(Mandatory)][string]$SubGroup,
        [Parameter(Mandatory)][string]$Setting
    )

    try {
        $out = (& powercfg.exe /query $Scheme $SubGroup $Setting 2>&1) -join "`n"
        $ac = $null
        $dc = $null
        if ($out -match 'Current AC Power Setting Index:\s*0x([0-9a-fA-F]+)') { $ac = [Convert]::ToInt32($Matches[1], 16) }
        if ($out -match 'Current DC Power Setting Index:\s*0x([0-9a-fA-F]+)') { $dc = [Convert]::ToInt32($Matches[1], 16) }
        if ($null -eq $ac -and $null -eq $dc) { return $null }
        return [pscustomobject]@{ Ac = $ac; Dc = $dc }
    } catch {
        return $null
    }
}

function Set-PowerValue {
    param(
        [Parameter(Mandatory)][string]$Scheme,
        [Parameter(Mandatory)][string]$SubGroup,
        [Parameter(Mandatory)][string]$Setting,
        [int]$AcValue = -1,
        [int]$DcValue = -1
    )

    if ($AcValue -ge 0) {
        & powercfg.exe /setacvalueindex $Scheme $SubGroup $Setting $AcValue 2>&1 | Out-Null
        if ($LASTEXITCODE -ne 0) { throw "powercfg rejected the AC value for $Setting." }
    }
    if ($DcValue -ge 0) {
        & powercfg.exe /setdcvalueindex $Scheme $SubGroup $Setting $DcValue 2>&1 | Out-Null
        if ($LASTEXITCODE -ne 0) { throw "powercfg rejected the DC value for $Setting." }
    }
    # Re-activating the scheme is what makes the change take effect immediately.
    & powercfg.exe /setactive $Scheme 2>&1 | Out-Null
}

function Get-ThermalSnapshot {
    $snap = [pscustomobject]@{
        MaxClockMHz     = $null
        CurrentClockMHz = $null
        ThrottleRatio   = $null
        TempCelsius     = $null
        OnBattery       = $null
    }

    try {
        $cpu = Get-CimInstance Win32_Processor -ErrorAction Stop | Select-Object -First 1
        $snap.MaxClockMHz     = $cpu.MaxClockSpeed
        $snap.CurrentClockMHz = $cpu.CurrentClockSpeed
        if ($cpu.MaxClockSpeed -gt 0) {
            $snap.ThrottleRatio = [math]::Round(($cpu.CurrentClockSpeed / $cpu.MaxClockSpeed) * 100, 0)
        }
    } catch { }

    try {
        $batt = Get-CimInstance Win32_Battery -ErrorAction SilentlyContinue | Select-Object -First 1
        if ($batt) { $snap.OnBattery = ($batt.BatteryStatus -eq 1) }
    } catch { }

    try {
        # Not exposed by every AMD laptop firmware - absence is normal, not an error.
        $tz = Get-CimInstance -Namespace 'root/wmi' -ClassName MSAcpi_ThermalZoneTemperature -ErrorAction Stop | Select-Object -First 1
        if ($tz) { $snap.TempCelsius = [math]::Round(($tz.CurrentTemperature / 10) - 273.15, 1) }
    } catch { }

    return $snap
}

function Invoke-PowerTuning {
    <#
        Balanced mode:
          * leave Power saver behind and use the Balanced plan
          * allow the CPU to reach 100% on AC (many OEM images cap it)
          * let the CPU idle down to 5%, which runs cooler and quieter
          * active cooling on AC - spin the fan before downclocking
        Battery behaviour is deliberately left conservative.
    #>
    $ctx = Get-OptContext
    Write-OptLog 'Checking power and thermal policy...' 'Info'

    $changed = 0
    $active = Get-ActivePowerScheme

    if (-not $active) {
        Write-OptLog 'Could not read the active power plan; skipping power tuning.' 'Warn'
        return 0
    }

    Write-OptLog "Active power plan: $($active.Name)" 'Finding'

    # --- move off Power saver ---------------------------------------------
    if ($active.Name -match 'Power saver') {
        $oldGuid = $active.Guid
        $newGuid = $script:BalancedScheme
        $action = { & powercfg.exe /setactive $newGuid 2>&1 | Out-Null }.GetNewClosure()

        if (Invoke-Guarded `
                -Description 'Switched from Power saver to the Balanced power plan' `
                -UndoType 'PowerScheme' `
                -UndoData @{ OldSchemeGuid = $oldGuid } `
                -Action $action) {
            $changed++
            $active = Get-ActivePowerScheme
        }
    }

    if (-not $active) { return $changed }
    $scheme = $active.Guid

    # --- processor maximum on AC ------------------------------------------
    $max = Get-PowerValue -Scheme $scheme -SubGroup $script:SubProcessor -Setting $script:Settings.ProcThrottleMax
    if ($max -and $null -ne $max.Ac -and $max.Ac -lt 100) {
        $sub = $script:SubProcessor
        $set = $script:Settings.ProcThrottleMax
        $oldAc = $max.Ac
        $oldDc = $max.Dc
        $action = { Set-PowerValue -Scheme $scheme -SubGroup $sub -Setting $set -AcValue 100 }.GetNewClosure()

        if (Invoke-Guarded `
                -Description "Raised the processor maximum on AC power from $oldAc% to 100% - the CPU was capped below its rated speed" `
                -UndoType 'PowerValue' `
                -UndoData @{ Scheme = $scheme; SubGroup = $sub; Setting = $set; OldAcValue = $oldAc; OldDcValue = $oldDc } `
                -Action $action) {
            $changed++
        }
    } elseif ($max) {
        Write-OptLog 'Processor maximum is already 100% on AC power.' 'Finding'
    }

    # --- processor minimum ------------------------------------------------
    $min = Get-PowerValue -Scheme $scheme -SubGroup $script:SubProcessor -Setting $script:Settings.ProcThrottleMin
    if ($min -and $null -ne $min.Ac -and $min.Ac -gt 5) {
        $sub = $script:SubProcessor
        $set = $script:Settings.ProcThrottleMin
        $oldAc = $min.Ac
        $oldDc = $min.Dc
        $action = { Set-PowerValue -Scheme $scheme -SubGroup $sub -Setting $set -AcValue 5 -DcValue 5 }.GetNewClosure()

        if (Invoke-Guarded `
                -Description "Lowered the processor minimum from $oldAc% to 5% - lets the CPU idle down, which means less heat and quieter fans" `
                -UndoType 'PowerValue' `
                -UndoData @{ Scheme = $scheme; SubGroup = $sub; Setting = $set; OldAcValue = $oldAc; OldDcValue = $oldDc } `
                -Action $action) {
            $changed++
        }
    }

    # --- cooling policy ----------------------------------------------------
    $cool = Get-PowerValue -Scheme $scheme -SubGroup $script:SubProcessor -Setting $script:Settings.SystemCooling
    if ($cool -and $null -ne $cool.Ac -and $cool.Ac -ne 1) {
        $sub = $script:SubProcessor
        $set = $script:Settings.SystemCooling
        $oldAc = $cool.Ac
        $oldDc = $cool.Dc
        $action = { Set-PowerValue -Scheme $scheme -SubGroup $sub -Setting $set -AcValue 1 }.GetNewClosure()

        if (Invoke-Guarded `
                -Description 'Set active cooling on AC power - the fan now spins up before the CPU downclocks, instead of the other way round' `
                -UndoType 'PowerValue' `
                -UndoData @{ Scheme = $scheme; SubGroup = $sub; Setting = $set; OldAcValue = $oldAc; OldDcValue = $oldDc } `
                -Action $action) {
            $changed++
        }
    }

    # --- report, do not change --------------------------------------------
    $thermal = Get-ThermalSnapshot
    if ($thermal.ThrottleRatio -and $thermal.ThrottleRatio -lt 60) {
        Write-OptLog "The CPU is currently running at $($thermal.ThrottleRatio)% of its rated clock. If that persists on AC power after a reboot, it is a firmware or cooling issue rather than a Windows setting - check HP's BIOS updates." 'Finding'
    }
    if ($null -ne $thermal.TempCelsius) {
        Write-OptLog "CPU thermal zone reports $($thermal.TempCelsius) degrees C." 'Finding'
    }

    $ctx.Stats.PowerTuned += $changed
    if ($changed -eq 0) {
        Write-OptLog 'Power policy was already set correctly - nothing to change.' 'Finding'
    }
    return $changed
}

Export-ModuleMember -Function Get-ActivePowerScheme, Get-PowerValue, Set-PowerValue,
    Get-ThermalSnapshot, Invoke-PowerTuning
