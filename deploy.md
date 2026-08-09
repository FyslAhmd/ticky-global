# 🚀 Ticky Global - Bulletproof cPanel/AlmaLinux Deployment Guide

This guide has been battle-tested on a strict AlmaLinux 10 + cPanel server with 2GB RAM. It bypasses typical cPanel restrictions by natively registering the application via WHM APIs and perfectly adapting the Node.js 22 runtime.

---

## 🛑 Step 0: Point Your DNS
1. Add an **A Record** for `@` pointing to `92.205.187.233`.
2. Add an **A Record** for `www` pointing to `92.205.187.233`.

---

## 💾 Step 1: Create a Swap File (Memory Protection)
Since your VPS has 2GB RAM, we must add a 2GB Swap to prevent out-of-memory crashes during heavy NPM builds.
```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

---

## 🛠️ Step 2: Install Node.js 22 & Passenger
Install cPanel's native application managers:
```bash
sudo dnf install -y ea-nodejs22 ea-apache24-mod-passenger ea-apache24-mod_env
```

---

## 🗄️ Step 3: Secure & Setup the Database
**1. Secure MariaDB:**
Find the config file: `sudo grep -R "bind-address" /etc/my.cnf /etc/my.cnf.d/ 2>/dev/null`
Edit the file it outputs (e.g., `sudo nano /etc/my.cnf.d/server.cnf`) and uncomment/change it to:
```ini
bind-address = 127.0.0.1
```
Restart MariaDB: `sudo systemctl restart mariadb`

**2. Create Database & User:**
```bash
sudo mysql
```
```sql
CREATE DATABASE tickyglobal;
CREATE USER 'tickyuser'@'localhost' IDENTIFIED BY 'YourStrongPassword';
GRANT ALL PRIVILEGES ON tickyglobal.* TO 'tickyuser'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

## 👤 Step 4: Create the cPanel Account
Do not deploy Node apps on your root SSH user. Create a dedicated cPanel account via API:
```bash
sudo whmapi1 createacct domain=tickyglobal.com username=tickyapp password='YourStrongPassword123!'
```

---

## 🔑 Step 5: GitHub SSH Key
Generate an SSH key to safely clone your private repo:
```bash
sudo -u tickyapp ssh-keygen -t ed25519 -C "vps-deploy-key"
```
Print the key (`sudo cat /home/tickyapp/.ssh/id_ed25519.pub`), add it to your GitHub Repository Deploy Keys, and test the connection:
```bash
sudo -u tickyapp ssh -T git@github.com
```

---

## 📥 Step 6: Clone & Clean Setup
**1. Clone into the new user's home:**
```bash
cd /home/tickyapp
sudo -u tickyapp git clone git@github.com:FyslAhmd/ticky-global.git
cd ticky-global
```

**2. Environment Variables:**
```bash
sudo -u tickyapp cp .env.example .env
sudo nano .env
```
Ensure `DATABASE_URL` matches your newly created database exactly.

**3. Strip Broken AI Mirrors & Install:**
The AI included a `package-lock.json` hardcoded to an offline private mirror (`npm.mirrors.msh.team`). You MUST delete it so npm reaches the public registry:
```bash
sudo rm -f package-lock.json
sudo -u tickyapp /opt/cpanel/ea-nodejs22/bin/npm install
```

---

## 🏗️ Step 7: Database Seeding & Node 22 Fix
**1. Direct SQL Import (Bypass Drizzle Dialect Issues):**
Because MariaDB throws syntax errors on Drizzle's strict MySQL `serial` migrations, inject the provided SQL dump directly:
```bash
mysql -u tickyuser -p tickyglobal < db/ticky-global-database.sql
```

**2. Fix Node 22 Top-Level Await Crash:**
Node.js 22 blocks Passenger's `require()` loader if your app uses top-level await. Wrap the production boot sequence in an async function:
```bash
sudo nano api/boot.ts
```
Change the bottom block to this:
```typescript
if (env.isProduction) {
  (async () => {
    const { serve } = await import("@hono/node-server");
    const { serveStaticFiles } = await import("./lib/vite");
    serveStaticFiles(app);
    const port = parseInt(process.env.PORT || "3000");
    serve({ fetch: app.fetch, port }, () => {
      console.log(`Server running on http://localhost:${port}/`);
    });
  })();
}
```

---

## 🚀 Step 8: Build & Register App
**1. Build the App:**
```bash
sudo -u tickyapp /opt/cpanel/ea-nodejs22/bin/npm run build
```

**2. Create the Passenger Entry File:**
Passenger natively looks for `app.js`. Give it exactly what it wants:
```bash
sudo -u tickyapp sh -c 'echo "import \"./dist/boot.js\";" > app.js'
```

**3. Register with cPanel:**
```bash
sudo uapi --output=jsonpretty \
  --user=tickyapp \
  PassengerApps \
  register_application \
  name='tickyglobal' \
  path='/ticky-global' \
  domain='tickyglobal.com'
```

**4. Generate SSL:**
```bash
sudo /usr/local/cpanel/bin/autossl_check --user=tickyapp
```
*(Ignore warnings about mail/cpanel subdomains. As long as tickyglobal.com passes DCV, you are good!).*

---
---

# 🔄 How to Deploy Updates in the Future
When you push new code to GitHub and want to update the live server, run these exact commands:

```bash
# 1. Enter your app directory
cd /home/tickyapp/ticky-global

# 2. Pull the latest code (as the correct user)
sudo -u tickyapp git pull origin main

# 3. Install any new packages
sudo -u tickyapp /opt/cpanel/ea-nodejs22/bin/npm install

# 4. Rebuild the application
sudo -u tickyapp /opt/cpanel/ea-nodejs22/bin/npm run build

# 5. Tell Passenger to restart the live application
sudo -u tickyapp touch tmp/restart.txt
```
*(Your app will restart instantly on the next web request with zero downtime!)*
