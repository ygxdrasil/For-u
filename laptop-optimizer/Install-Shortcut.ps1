<#
.SYNOPSIS
    Puts Laptop Optimizer in the Start menu so it can be pinned.

.DESCRIPTION
    Creates a shortcut that launches the app directly through powershell.exe
    with the "run as administrator" flag set, so there is no console window and
    no second launcher in the way. Run it once.

.PARAMETER Desktop
    Also drop a shortcut on the desktop.

.PARAMETER Remove
    Delete the shortcuts again.

.EXAMPLE
    .\Install-Shortcut.ps1
    Then: Start menu > Laptop Optimizer > right-click > Pin to Start.
#>

[CmdletBinding()]
param(
    [switch]$Desktop,
    [switch]$Remove
)

$ErrorActionPreference = 'Stop'

$root       = Split-Path -Parent $MyInvocation.MyCommand.Definition
$scriptPath = Join-Path $root 'Optimize.ps1'

if (-not (Test-Path $scriptPath)) {
    throw "Optimize.ps1 was not found next to this script. Keep the folder together."
}

$startMenu    = Join-Path ([Environment]::GetFolderPath('Programs')) 'Laptop Optimizer.lnk'
$desktopLink  = Join-Path ([Environment]::GetFolderPath('Desktop'))  'Laptop Optimizer.lnk'

if ($Remove) {
    foreach ($p in @($startMenu, $desktopLink)) {
        if (Test-Path $p) {
            Remove-Item $p -Force
            Write-Host "Removed $p" -ForegroundColor Yellow
        }
    }
    return
}

function Set-RunAsAdminFlag {
    <#
        A .lnk has no scriptable "run as administrator" property, so set the bit
        directly: byte 21 of the header, flag 0x20.
    #>
    param([string]$LinkPath)

    $bytes = [System.IO.File]::ReadAllBytes($LinkPath)
    if ($bytes.Length -lt 22) { return }
    $bytes[21] = $bytes[21] -bor 0x20
    [System.IO.File]::WriteAllBytes($LinkPath, $bytes)
}

function New-AppShortcut {
    param([string]$Path)

    $shell = New-Object -ComObject WScript.Shell
    $link = $shell.CreateShortcut($Path)

    $link.TargetPath       = Join-Path $env:SystemRoot 'System32\WindowsPowerShell\v1.0\powershell.exe'
    $link.Arguments        = "-NoProfile -ExecutionPolicy Bypass -STA -WindowStyle Hidden -File `"$scriptPath`""
    $link.WorkingDirectory = $root
    $link.Description      = 'Measure this laptop, find what is slowing it down, and fix the safe things.'
    $link.IconLocation     = "$env:SystemRoot\System32\shell32.dll,21"
    $link.Save()

    Set-RunAsAdminFlag -LinkPath $Path
    Write-Host "Created $Path" -ForegroundColor Green
}

New-AppShortcut -Path $startMenu
if ($Desktop) { New-AppShortcut -Path $desktopLink }

Write-Host ''
Write-Host 'Done. Open the Start menu, search for "Laptop Optimizer", then right-click it and choose Pin to Start.' -ForegroundColor Cyan
Write-Host 'It will prompt for administrator rights each time - that is required to change services and startup entries.' -ForegroundColor Gray
