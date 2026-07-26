# The laptop bridge

Grace runs on a server somewhere else. Your PlayStation only takes orders from
something on your own Wi-Fi — waking one is a broadcast on the local network,
and no amount of cloud gets around that.

So this small program runs on the laptop that's already switched on in your
room. It asks Grace every fifteen seconds whether she's left an instruction,
does it, and tells her what happened.

It only ever dials out. Nothing here listens on a port, so there's no router
setting to change and nothing on your home network becomes reachable from
outside.

## What she can actually do

| | |
|---|---|
| Turn the PlayStation on | ✅ |
| Put it into rest mode | ✅ |
| Tell you if it's on, and what's running | ✅ |
| Start a specific game | ❌ |
| Press buttons | ❌ |

The last two aren't a decision about what she's trusted with. A PS5 won't
accept them from anything except a live Remote Play session — a video stream
with a virtual controller attached — which is a different piece of software
entirely. She'll say so rather than pretend she tried.

## Setting it up

Do this once, on the laptop that stays on. You need **Node 18 or newer** —
check with `node --version`.

**1. Get the files onto the laptop.**

```
git clone https://github.com/ygxdrasil/For-u.git
cd For-u/bridge
npm install
```

**2. Tell it where Grace is.**

```
cp config.example.json config.json
```

Open `config.json` and paste in your bridge token. You'll find it in Grace:
open the side panel (top right), under **The laptop bridge**.

**3. Pair with the console.** Turn the PS5 on first, then:

```
npm run pair
```

It opens a browser to sign in to PlayStation, then asks for an eight-digit
code. On the console that's **Settings → System → Remote Play → Link Device**.
Type in the number it shows. This is the same pairing Remote Play uses, and
you only do it once.

**4. Start it.**

```
npm start
```

You should see it find the console. Now ask Grace to turn on your PlayStation.

## Keeping it running

The point is that it's always there, so it should start with the laptop.

**Windows** — press `Win+R`, type `shell:startup`, and put a file called
`grace-bridge.cmd` in the folder that opens:

```
cd /d C:\path\to\For-u\bridge
npm start
```

**macOS** — System Settings → General → Login Items → add a small script that
runs `npm start` in this folder.

**Linux** — a systemd user service, or whatever your desktop uses for startup
programs.

## When it doesn't work

**"No console answered yet."** The PS5 is off at the wall, on a different
network, or the laptop is on a guest Wi-Fi that blocks broadcasts. If you know
the console's IP, put it in `config.json` as `ps5Ip` — that skips discovery.

**"Grace does not recognise this token."** The token in `config.json` doesn't
match the one in her side panel. Copy it again.

**Waking fails after pairing.** Rest mode has to be allowed to accept it:
on the console, **Settings → System → Power Saving → Features Available in
Rest Mode**, and turn on *Stay Connected to the Internet* and *Enable Turning
On PS5 from Network*. Without those the console genuinely cannot be woken by
anything, including Sony's own app.
