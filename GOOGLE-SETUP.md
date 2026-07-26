# Connecting Grace to Gmail and Calendar

This is the one part I can't do for you — Google requires a human to click
through their console. It takes about ten minutes and costs nothing.

At the end you paste **two values** into Vercel. That's the whole job.

---

## 1. Make a project

1. Go to <https://console.cloud.google.com/>
2. Project dropdown at the top → **New Project** → name it `grace` → **Create**
3. Wait for it to finish, then make sure it's selected in that dropdown

## 2. Turn on the two APIs

1. <https://console.cloud.google.com/apis/library/gmail.googleapis.com> → **Enable**
2. <https://console.cloud.google.com/apis/library/calendar-json.googleapis.com> → **Enable**

Both are free. Neither needs a billing account.

## 3. Set up the consent screen

1. Go to <https://console.cloud.google.com/auth/overview> → **Get started**
2. **App name**: `Grace`. **User support email**: your own address.
3. **Audience**: choose **External**. (Internal is only offered to Google
   Workspace organisations. A personal Gmail account has to use External.)
4. **Contact information**: your email again → **Create**

## 4. Add the permissions she needs

Go to **Data access** → **Add or remove scopes** → paste these in the manual
box, one per line:

```
https://www.googleapis.com/auth/gmail.readonly
https://www.googleapis.com/auth/gmail.compose
https://www.googleapis.com/auth/calendar.events
```

**Update** → **Save**.

Google will warn you that two of these are "restricted". That's expected and
fine — the warning is aimed at apps with lots of users, and this one has you.

> **On `gmail.compose`:** Google publishes no draft-only permission, so this
> scope technically includes the ability to send mail. Grace does not use it.
> There is no code in her that sends anything, and her self-test fails if a
> send call is ever added. Your hard limit is enforced in the code, not by
> Google's permission list — because Google's list can't express it.

## 5. **Publish the app** — don't skip this

Go to **Audience** → **Publish app** → confirm.

This matters more than it looks. While an app is in "Testing", Google expires
its access **every 7 days**, and Grace would silently lose your mail and diary
every week. Publishing stops that.

You do **not** need Google to verify the app. Their own rules exempt apps used
only by the person who built them. You'll see a "Google hasn't verified this
app" screen once when connecting — click **Advanced** → **Go to Grace
(unsafe)**. That's you, and it's expected.

## 6. Create the credentials

1. Go to <https://console.cloud.google.com/auth/clients> → **Create client**
2. **Application type**: **Web application**
3. **Name**: `grace-web`
4. Under **Authorized redirect URIs** → **Add URI**, and paste **exactly** this:

   ```
   https://grace-vercel.vercel.app/api/google/callback
   ```

   No trailing slash. It has to match character for character, or Google
   refuses with `redirect_uri_mismatch`. Grace shows you the exact string she
   expects in **Sound check → Full diagnosis** if you ever need to check.

5. **Create**

You'll get a **Client ID** (ends in `.apps.googleusercontent.com`) and a
**Client secret** (starts with `GOCSPX-`). Copy both — the secret is only
shown once, though you can download it again later.

## 7. Paste them into Vercel

Vercel → your Grace project → **Settings** → **Environment Variables**. Add
three, all for **Production**:

| Name | Value |
| --- | --- |
| `GOOGLE_CLIENT_ID` | the client ID you just copied |
| `GOOGLE_CLIENT_SECRET` | the client secret you just copied |
| `GRACE_OWNER_EMAIL` | your own Gmail address |

That third one matters: it stops anyone else who finds the link from
connecting *their* Google account to *your* Grace.

Optionally add `GOOGLE_REDIRECT_URI` set to the same URL from step 6 — only
needed if you put Grace on a custom domain later.

Then **Redeploy** (Deployments → latest → ⋯ → Redeploy).

## 8. Connect

Open Grace. The **Mail** and **Diary** orbs will offer **Connect Google**.
Click it, choose your account, click through the unverified-app warning, and
grant the permissions.

They'll turn from grey to lit, and she'll start answering "what's on today?"
and "anything from Sam?" properly.

---

## If something goes wrong

**`redirect_uri_mismatch`** — the URI in step 6 doesn't match. Check for a
trailing slash, `http` instead of `https`, or a typo in the domain. Changes
can take a few minutes to take effect.

**"Grace has been disconnected"** — Google drops the connection if you change
your Google password, revoke access at
<https://myaccount.google.com/permissions>, or don't use it for six months.
Click **Reconnect**.

**It connected but she says the diary is empty** — check you granted all three
permissions. Google lets you untick them individually on the consent screen,
and unticking one leaves the others working.
