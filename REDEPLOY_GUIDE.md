# 🔄 Ticky Global - Redeployment Guide

This guide explains how to safely and quickly deploy new code updates to the live server after you have pushed changes to your GitHub repository. 

Since the application is hosted on cPanel using Phusion Passenger, we do not need to take the server offline. Passenger supports "Zero-Downtime" restarts.

---

## 🚀 The 5-Step Redeployment Process

When you have pushed your new updates to the `main` branch on GitHub, follow these steps to update the live website:

### Step 1: Navigate to the Project Folder
Log into your server via SSH, then navigate to the directory where the application lives:
```bash
cd /home/tickyapp/ticky-global
```

### Step 2: Pull the Latest Code
Download the latest changes you just pushed to GitHub. It is **critical** to use `sudo -u tickyapp` for all commands so that file permissions remain correct and the files aren't accidentally owned by root/tickyglobal!
```bash
sudo -u tickyapp git pull origin main
```
*(Note: If you have conflicting changes on the server, you may need to run `sudo -u tickyapp git stash` before pulling, but generally the server should remain clean).*

### Step 3: Install Dependencies & Rebuild
If you added new packages, you need to install them. Then, re-compile the frontend React app and the backend Node server. 

Because cPanel uses specific paths for its Node versions, use the exact absolute path for npm:
```bash

# 0. reset permission to ticky app
sudo chown -R tickyapp:tickyapp /home/tickyapp/ticky-global

# 1. Install any new packages
sudo -u tickyapp /opt/cpanel/ea-nodejs22/bin/npm install

# 2. Rebuild the application
sudo -u tickyapp /opt/cpanel/ea-nodejs22/bin/npm run build
```

### Step 4: Trigger a Zero-Downtime Restart
Unlike PM2 or Docker where you have to stop and start a process, Phusion Passenger watches for a specific text file. If the timestamp on `tmp/restart.txt` changes, Passenger will elegantly restart your app on the very next web request.

Run this single command:
```bash
sudo -u tickyapp touch tmp/restart.txt
```

---

## ✅ Verification
Open your browser and navigate to `https://www.tickyglobal.com`. Hard refresh the page (`Ctrl + F5` or `Cmd + Shift + R`) to ensure you are seeing the latest compiled frontend assets and that the server is responding correctly without any 502/503 errors.

You are done! 🎉

---

## ⚠️ Troubleshooting

**Error:** `npm error code EACCES` / `Permission denied` when running `npm install`
**Cause:** You forgot to add `sudo -u tickyapp` to the beginning of the command. Running it as your default user (`tickyglobal` or `root`) makes the system aggressively reject changes because the files belong to `tickyapp`.
**Fix:** Always ensure every deployment command is prefixed with `sudo -u tickyapp`. If you accidentally ran it without the prefix and corrupted some permissions, run this to restore ownership to the app user:
```bash
sudo chown -R tickyapp:tickyapp /home/tickyapp/ticky-global
```
