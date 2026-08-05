<#
    Common.psm1 - shared context, logging, dry-run guard and undo recording.

    Every module routes its changes through Invoke-Guarded so that:
      * dry-run mode can describe an action without performing it
      * a machine-readable undo record is written before the change lands
      * a failure is logged rather than thrown into the UI thread
#>

Set-StrictMode -Version 2.0

$script:Context = $null

function Initialize-OptContext {
    <#  Creates the run context. Called once by Optimize.ps1 at startup.  #>
    param(
        [string]$RootPath,
        [switch]$DryRun
    )

    $dataDir = Join-Path $RootPath 'data'
    if (-not (Test-Path $dataDir)) {
        New-Item -Path $dataDir -ItemType Directory -Force | Out-Null
    }

    $stamp = Get-Date -Format 'yyyyMMdd-HHmmss'

    $script:Context = [pscustomobject]@{
        RootPath    = $RootPath
        DataDir     = $dataDir
        RunId       = $stamp
        LogPath     = Join-Path $dataDir "run-$stamp.log"
        UndoPath    = Join-Path $dataDir "undo-$stamp.json"
        DryRun      = [bool]$DryRun
        Entries     = New-Object System.Collections.ArrayList
        UndoRecords = New-Object System.Collections.ArrayList
        UiCallback  = $null
        Stats       = [ordered]@{
            StartupDisabled  = 0
            ServicesChanged  = 0
            AppsRemoved      = 0
            BytesFreed       = [int64]0
            PowerTuned       = 0
            GraphicsTuned    = 0
            Failures         = 0
        }
    }

    return $script:Context
}

function Get-OptContext {
    if ($null -eq $script:Context) {
        throw 'Initialize-OptContext must be called before any optimizer module is used.'
    }
    return $script:Context
}

function Register-OptUiCallback {
    <#  The UI hands us a scriptblock that receives ($message, $level) for live display.  #>
    param([scriptblock]$Callback)
    (Get-OptContext).UiCallback = $Callback
}

function Write-OptLog {
    param(
        [Parameter(Mandatory)][string]$Message,

        # Info    - normal narration
        # Change  - something was actually altered on the machine
        # Warn    - notable, not fatal
        # Error   - an action failed
        # Finding - a diagnostic result, not an action
        [ValidateSet('Info', 'Change', 'Warn', 'Error', 'Finding')]
        [string]$Level = 'Info'
    )

    $ctx = Get-OptContext
    $line = '{0} [{1}] {2}' -f (Get-Date -Format 'HH:mm:ss'), $Level.ToUpper(), $Message

    [void]$ctx.Entries.Add([pscustomobject]@{
        Time    = Get-Date
        Level   = $Level
        Message = $Message
    })

    try {
        Add-Content -Path $ctx.LogPath -Value $line -Encoding UTF8 -ErrorAction Stop
    } catch {
        # A log write must never take down a run.
    }

    if ($ctx.UiCallback) {
        try { & $ctx.UiCallback $Message $Level } catch { }
    }
}

function Add-UndoRecord {
    <#
        Undo records are plain data so they survive to disk and can be replayed
        by a completely separate session. Each Type maps to a handler in Safety.psm1.
    #>
    param(
        [Parameter(Mandatory)][string]$Type,
        [Parameter(Mandatory)][hashtable]$Data,
        [string]$Description = ''
    )

    $ctx = Get-OptContext
    $record = [pscustomobject]@{
        Type        = $Type
        Description = $Description
        Data        = $Data
        Time        = (Get-Date).ToString('o')
    }
    [void]$ctx.UndoRecords.Add($record)
    Save-UndoLog
}

function Save-UndoLog {
    $ctx = Get-OptContext
    if ($ctx.UndoRecords.Count -eq 0) { return }
    try {
        $payload = [pscustomobject]@{
            RunId    = $ctx.RunId
            Created  = (Get-Date).ToString('o')
            Machine  = $env:COMPUTERNAME
            Records  = @($ctx.UndoRecords)
        }
        $payload | ConvertTo-Json -Depth 8 | Set-Content -Path $ctx.UndoPath -Encoding UTF8
    } catch {
        Write-OptLog "Could not write the undo file: $($_.Exception.Message)" 'Warn'
    }
}

function Invoke-Guarded {
    <#
        The single chokepoint for anything that modifies the machine.

        -Description  what the user sees, phrased as a completed action
        -Action       the scriptblock that does the work
        -UndoType     handler name in Safety.psm1
        -UndoData     everything needed to reverse it

        Returns $true when the change was applied, $false on dry-run or failure.
    #>
    param(
        [Parameter(Mandatory)][string]$Description,
        [Parameter(Mandatory)][scriptblock]$Action,
        [string]$UndoType,
        [hashtable]$UndoData
    )

    $ctx = Get-OptContext

    if ($ctx.DryRun) {
        Write-OptLog "WOULD: $Description" 'Info'
        return $false
    }

    # Record the undo *before* the change, so an action that half-succeeds is
    # still reversible.
    if ($UndoType -and $UndoData) {
        Add-UndoRecord -Type $UndoType -Data $UndoData -Description $Description
    }

    try {
        & $Action | Out-Null
        Write-OptLog $Description 'Change'
        return $true
    } catch {
        $ctx.Stats.Failures++
        Write-OptLog "Failed - $Description : $($_.Exception.Message)" 'Error'
        return $false
    }
}

function Test-IsAdmin {
    try {
        $id = [Security.Principal.WindowsIdentity]::GetCurrent()
        $principal = New-Object Security.Principal.WindowsPrincipal($id)
        return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
    } catch {
        return $false
    }
}

function Format-Bytes {
    param([double]$Bytes)
    if ($Bytes -ge 1TB) { return ('{0:N2} TB' -f ($Bytes / 1TB)) }
    if ($Bytes -ge 1GB) { return ('{0:N2} GB' -f ($Bytes / 1GB)) }
    if ($Bytes -ge 1MB) { return ('{0:N1} MB' -f ($Bytes / 1MB)) }
    if ($Bytes -ge 1KB) { return ('{0:N0} KB' -f ($Bytes / 1KB)) }
    return ('{0:N0} bytes' -f $Bytes)
}

Export-ModuleMember -Function Initialize-OptContext, Get-OptContext, Register-OptUiCallback,
    Write-OptLog, Add-UndoRecord, Save-UndoLog, Invoke-Guarded, Test-IsAdmin, Format-Bytes
