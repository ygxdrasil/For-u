# Laptop Optimizer

A Windows desktop app that measures your laptop, works out what is actually
slowing it down, and fixes the safe things automatically.

Written in PowerShell with a WPF interface, so it runs on any Windows 10 or 11
machine with **nothing to install**. PowerShell and WPF are already part of
Windows.

---

## Getting started

1. Copy the `laptop-optimizer` folder anywhere on the laptop.
2. Right-click `Install-Shortcut.ps1` → **Run with PowerShell**.
   This puts **Laptop Optimizer** in the Start menu with the "run as
   administrator" flag already set. Right-click it there → **Pin to Start**.
3. Open it. **Preview mode is on by default** — press *Run optimization* and it
   will tell you everything it would do without touching anything.
4. Read the results. When you are happy, untick *Preview only* and run it again.

If you would rather not install a shortcut, double-click `Launch.cmd` in the
folder instead. It does the same thing and asks for administrator rights.

> **Run it in preview mode first.** See *Honest limitations* at the bottom.

---

## What it does

### Diagnosis first

Most "PC optimizers" skip straight to deleting things. This one starts by
asking what is actually wrong, because on a healthy modern laptop the answer is
usually *one specific thing*, not a hundred small ones.

The **What is actually wrong** tab reports, in severity order:

- Heavyweight preinstalled security software (McAfee, Norton, HP Wolf) — the
  most common reason a brand-new HP feels slow at everything
- Whatever is eating the CPU right now, by name, with an explanation of whether
  it is temporary
- Memory pressure, with the top consumers named
- Disk space and drive health
- A pending restart that is holding Windows in a servicing state
- A power plan capping the CPU
- Per-app boot delays, taken from **Windows' own performance log** — these are
  measurements, not estimates

### Then the fixes

| Module | What it does |
|---|---|
| **Startup** | Enumerates every autostart location — `Run` keys, Startup folders, logon scheduled tasks — and disables entries on a curated junk list. Anything unrecognised is left alone and reported. |
| **Services** | Trims 20 curated background services. Prefers `Manual` over `Disabled` wherever Manual is enough. |
| **Power** | Moves off Power saver, lifts a CPU maximum capped below 100%, lowers the idle minimum so the chip runs cooler, and sets active cooling so the fan spins before the CPU downclocks. |
| **Graphics** | Enables hardware-accelerated GPU scheduling, sets switchable graphics to full performance on AC, and reports the things software cannot fix (see below). |
| **Storage** | Reads real SMART data — wear, temperature, power-on hours, health — then runs TRIM on an SSD or a defrag on a hard drive. It checks the media type first, because running the wrong one is harmful. |
| **Bloatware** | Detects 60 known preinstalled apps. **Never removes anything automatically.** |
| **Cleanup** | Off by default — the laptop is new. Scans and reports what is reclaimable so it is ready when the drive starts filling up. |

---

## The safety net

Three layers, because the whole point is that a bad call is never permanent.

**1. Preview mode.** On by default. Every action is described, nothing is done.

**2. A System Restore point** before the first change of a run.

**3. An undo file** — this is the one that matters day to day. Every individual
change is written to `data/undo-<timestamp>.json` *before* it is applied, with
enough detail to reverse exactly that change:

```json
{ "Type": "Service", "Data": { "Name": "DiagTrack", "OldStartType": "Automatic" } }
```

The **Undo** tab lists every previous run and reverses it on one click. Unlike
System Restore, it undoes only what this tool did and leaves everything else
you have done since alone.

### What is never touched

Hard-coded, regardless of what else matches:

- **Development tools** — WSL, Docker, Hyper-V, the VM platform, SSH agent,
  databases
- **Security** — Defender, the firewall, Windows Update
- **Hardware** — audio, touchpad, graphics drivers, HP hotkeys (the Fn keys and
  brightness controls)
- **Your files** — OneDrive is never silently disabled, and Windows Search stays
  on because you use this machine for school and work

### The one irreversible thing

Uninstalls. That is why the Bloatware tab never acts on its own: it shows what
it found, explains what each thing is, pre-ticks only the definitely-useless
ones, and waits for you. Every entry carries a plain-English description, and
six of them are marked **keep** — including Clipchamp (a free video editor) and
HP Command Center (which controls the fan profiles), because most bloatware
lists strip those and they earn their place here.

---

## Honest limitations

**This has never been run on Windows.** It was built and verified on Linux,
where the syntax, module structure, cross-module calls, undo-handler coverage
and safety lists can all be checked — but the parts that need real Windows
(WMI, the registry, `powercfg`, WPF itself) cannot be. Use preview mode first.
That is exactly what it is for.

**Your hardware is already fast.** A Ryzen 5 7000 with 16 GB is not a slow
machine. Expect real, measurable gains in boot time and battery, and expect the
*diagnosis* to be worth more than the optimization — if the laptop feels slow at
everything, the diagnosis tab is where you will find out why.

**Boot time cannot be re-measured immediately.** Windows records it at boot, so
the number will not move until you restart. The app says this rather than
showing you an improvement it has not earned.

**Some things are hardware, and the app says so.**

- *A screen that looks brighter from above and darker from below* is a TN panel
  viewing-angle characteristic. It is physical — no driver, registry key, colour
  profile or program changes it. Only an IPS panel does.
- *Integrated graphics performance* is capped by memory bandwidth. If the laptop
  has one RAM stick instead of two, the GPU gets roughly half the bandwidth it
  could have — the app detects this and reports it as the single biggest
  available improvement. It is a second stick of RAM, not a setting.

---

## Files

```
Optimize.ps1              the app - UI, orchestration, console mode
Launch.cmd                double-click launcher, elevates
Install-Shortcut.ps1      creates the Start menu shortcut
ui/MainWindow.xaml        the interface
modules/
  Common.psm1             context, logging, dry-run guard, undo recording
  Safety.psm1             restore point, undo log, undo replay
  Diagnostics.psm1        benchmarks and the culprit hunt
  Startup.psm1            autostart enumeration and disabling
  Services.psm1           service catalogue and the dev whitelist
  Power.psm1              power plan and thermal policy
  Graphics.psm1           GPU, memory channels, display
  Storage.psm1            SMART health and TRIM
  Bloatware.psm1          preinstalled software catalogue
  Cleanup.psm1            disk cleanup (off by default)
data/                     logs, benchmarks and undo files (created on first run)
```

Every change on the machine goes through one function — `Invoke-Guarded` in
`Common.psm1` — which handles preview mode, writes the undo record before
acting, and catches failures so one bad call cannot take down a run.

## Command line

```powershell
# see everything it would do, no window, no changes
.\Optimize.ps1 -Console -DryRun

# apply, no window
.\Optimize.ps1 -Console
```
