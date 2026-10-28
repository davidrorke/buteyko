# Buteyko Practice

A Buteyko breathing practice timer that installs like an app on Windows, Android, iPhone and iPad. Each person signs in with their own Google account and their history is saved to a file in their own Google Drive, so it syncs across their devices. There is no server and you never see anyone's data.

## What's in the folder

| File | Purpose |
|---|---|
| index.html | The app |
| config.js | The one line you edit: your Google client ID |
| sw.js | Makes the app work offline. Bump VERSION when you change files |
| manifest.webmanifest, icon-*.png | Lets it install as an app with its own icon |
| privacy.html | Privacy policy page, required by Google's sign-in screen |

Before going live, put a contact email in privacy.html where it says [Your contact email].

## Setup, about an hour the first time

### 1. Put the files on GitHub Pages

1. Create a free GitHub account if needed, then a new **public** repository, for example `buteyko`.
2. Upload every file in this folder to the repository root (Add file > Upload files > Commit).
3. Go to Settings > Pages. Under "Build and deployment" choose **Deploy from a branch**, branch **main**, folder **/ (root)**, then Save.
4. After a minute the site is live at `https://YOURNAME.github.io/buteyko/`. Open it to check. The app works now, but without sync.

Note the **origin**, which is just `https://YOURNAME.github.io` with no folder and no trailing slash. Google needs it in step 3.

### 2. Create the Google Cloud project

1. Go to https://console.cloud.google.com and sign in with the Google account that will own the app (yours, not Bea's).
2. Top bar project picker > **New project**, name it `Buteyko Practice`, Create, then select it.
3. Menu > **APIs & Services > Library**, search **Google Drive API**, open it and click **Enable**.

### 3. Set up the sign-in screen and client ID

Google calls this area **Google Auth Platform** (older guides say "OAuth consent screen"). Menu > APIs & Services > OAuth consent screen will take you there.

1. **Get started / Branding**
   - App name: `Buteyko Practice`
   - User support email: your email
   - Audience: **External**
   - Contact email: your email
   - Under Branding, also fill in:
     - App home page: `https://YOURNAME.github.io/buteyko/`
     - Privacy policy: `https://YOURNAME.github.io/buteyko/privacy.html`
     - Authorized domains: `YOURNAME.github.io`
   - Skip the logo. Adding a logo triggers a brand review.
2. **Data access > Add or remove scopes**: tick `.../auth/drive.file` ("See, edit, create and delete only the specific Google Drive files you use with this app"). Save. This is a non-sensitive scope, so no security review is needed.
3. **Clients > Create client**
   - Application type: **Web application**
   - Name: `Buteyko web`
   - Authorized JavaScript origins: `https://YOURNAME.github.io`, plus `http://localhost:8080` if you want to test locally
   - Leave redirect URIs empty, then Create.
   - Copy the **Client ID**. It ends in `.apps.googleusercontent.com`.
4. **Audience**: the app starts in **Testing**, which only lets listed test users sign in. Either:
   - add Bea and anyone else under **Test users** (up to 100), or
   - click **Publish app** to make it available to anyone with a Google account. With only the drive.file scope this shouldn't need Google verification. If Google does ask for brand verification, it's a quick check of your app name and links.

   While in Testing, Google may ask users to sign in again every 7 days. Publishing removes that.

### 4. Plug in the client ID

Edit `config.js` on GitHub (open the file, pencil icon), paste the client ID between the quotes, and commit:

```js
googleClientId: "1234567890-abc123.apps.googleusercontent.com"
```

Wait a minute for Pages to update, then reload the app. A **Sign in to sync** button appears at the top.

## Installing on each device

- **Windows (Edge or Chrome)**: open the site, then click the install icon in the address bar, or use menu > Apps > Install. It gets a Start menu entry and its own window.
- **Android (Chrome)**: menu > **Install app** or **Add to Home screen**.
- **iPhone / iPad (Safari)**: Share > **Add to Home Screen**.

The first time on each device, tap **Sign in to sync** and choose the Google account. Google asks for permission to "see, edit, create and delete only the specific Google Drive files you use with this app". Make sure that box is ticked.

## Bringing over existing history

History from the earlier single-file version doesn't come across on its own. In the old version, go to History > **Save backup file**. In the new app, go to History > **Restore from backup file** > **Add them to my history**. It then syncs to Drive.

## How sync behaves

- Everything saves on the device first, so the app works fully offline and syncs when back online.
- Google sign-in lasts about an hour. After that the top button shows **Tap to sync**. Saving, editing or deleting a session also renews it automatically, sometimes with a quick sign-in window that closes by itself.
- Edits and deletions carry across devices. If the same session was changed on two devices, the most recent change wins.
- If a different Google account signs in on a device that has someone else's history, the app stops and asks before mixing anything.
- The log is `Buteyko Practice log.json` in a **Buteyko Practice** folder in the user's Drive. Google Drive keeps version history for it.

Known quirk: on iPhone and iPad, when installed to the home screen, Google's sign-in window can be awkward. If it misbehaves, sign in once from Safari itself.

## Updating the app later

1. Upload the changed files to the repository.
2. In `sw.js`, change `VERSION` (for example `bp-1.0.1`), so installed copies fetch the new files.

Installed apps pick up the update the next time they're opened online. Users' history is untouched.

## Testing locally

```
python -m http.server 8080
```

Then open http://localhost:8080. This needs `http://localhost:8080` in the client's authorized origins.
