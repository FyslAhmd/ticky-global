# 🚀 Ticky Global - Advanced cPanel/AlmaLinux Deployment Guide

Welcome! This guide has been rigorously refined for your specific environment (AlmaLinux 10 + cPanel with 2GB RAM). We will deploy everything purely via the SSH terminal using cPanel's native APIs (`UAPI`) to ensure we don't break any cPanel configurations.

---

## 🛑 Step 0: Point Your Domain
If you haven't already, ensure your DNS is resolving to your VPS so cPanel can issue an SSL certificate later.
1. Add an **A Record** for `@` pointing to `92.205.187.233`.
2. Add an **A Record** for `www` pointing to `92.205.187.233`.

---

## 💾 Step 1: Create a Swap File (Memory Pressure Protection)
Your VPS has 2GB of RAM, and cPanel is already consuming a large portion of it. While Swap is not a replacement for physical RAM, it acts as a critical safety net to prevent the server from completely crashing during heavy operations (like running `npm install`).

```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Make the swap permanent:
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

---

## 🛠️ Step 2: Install Node.js & Passenger
We need to install the official cPanel EasyApache packages for Node.js 22 and Passenger.

```bash
sudo dnf install -y ea-nodejs22 ea-apache24-mod-passenger ea-apache24-mod_env
```

---

## 🗄️ Step 3: Secure & Setup the Database
cPanel already installed MariaDB, but it might be listening publicly. We want it restricted to localhost.

**1. Secure MariaDB:**
Open the configuration file:
```bash
sudo nano /etc/my.cnf.d/mariadb-server.cnf
```
Under the `[mysqld]` section, add this line:
```ini
bind-address = 127.0.0.1
```
*(Save and exit: `Ctrl + O` -> `Enter` -> `Ctrl + X`).*

Restart MariaDB to apply the security fix:
```bash
sudo systemctl restart mariadb
```

**2. Create the Database:**
Log into MySQL:
```bash
sudo mysql
```
Run these commands *(Change `YourStrongPassword`!)*:
```sql
CREATE DATABASE tickyglobal;
CREATE USER 'tickyuser'@'localhost' IDENTIFIED BY 'YourStrongPassword';
GRANT ALL PRIVILEGES ON tickyglobal.* TO 'tickyuser'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

## 🔑 Step 4: GitHub SSH Authentication
Since your repository is private, the server needs permission to clone it. We will use a Deploy Key.

**1. Generate an SSH key:**
```bash
ssh-keygen -t ed25519 -C "vps-deploy-key"
```
*(Press Enter for all prompts to use the default path and no passphrase).*

**2. View and copy the public key:**
```bash
cat ~/.ssh/id_ed25519.pub
```
**3. Add to GitHub:** Go to your `ticky-global` repository on GitHub -> **Settings** -> **Deploy keys** -> **Add deploy key**. Paste the key you just copied.

---

## 📥 Step 5: Clone & Configure
**1. Clone the repository:**
```bash
cd /home/tickyglobal
git clone git@github.com:FyslAhmd/ticky-global.git
cd ticky-global
```

**2. Configure Environment Variables:**
```bash
cp .env.example .env
nano .env
```
Update your `.env` variables carefully. Make sure the database URL is exactly what you created in Step 3. (Add your AWS S3 credentials here as well).
```env
DATABASE_URL=mysql://tickyuser:YourStrongPassword@localhost:3306/tickyglobal
NODE_ENV=production
```

---

## 🏗️ Step 6: Build & Symlink Entry Point
We will build the application using the cPanel Node.js version.

```bash
# Export the correct Node path
export PATH=/opt/cpanel/ea-nodejs22/bin:$PATH

# Install dependencies
npm install

# Push database schema
npm run db:push

# Build the app (this outputs to the dist/ folder)
npm run build
```

**Crucial Passenger Step:**
By default, cPanel Passenger looks for an `app.js` file to start the application. Since our app is built into `dist/boot.js`, the absolute cleanest way to configure this without hacking Apache configs is to create a symlink:
```bash
ln -s dist/boot.js app.js
```

---

## 🚀 Step 7: Register App via cPanel UAPI
Instead of manually writing `.htaccess` rules (which can cause conflicts), we will use cPanel's official API to register the application. This ensures cPanel natively routes traffic from your domain to your Node.js app!

Run this command:
```bash
uapi --user=tickyglobal PassengerApps register_application name="tickyglobal" path="ticky-global" domain="tickyglobal.com" deployment_mode="production"
```

---

## 🔒 Step 8: Secure with SSL (AutoSSL)
Force cPanel to issue a Let's Encrypt SSL certificate for your domain:
```bash
sudo /usr/local/cpanel/bin/autossl_check --user=tickyglobal
```
*(This may take a few minutes. Make sure your domain is fully pointed to the server's IP).*

---

### 🎉 You're Done!
Your application is now securely running, integrated deeply and safely into the cPanel ecosystem!

**To update your app in the future:**
1. Pull the new code: `git pull`
2. Rebuild: `npm run build`
3. Tell Passenger to restart: `touch tmp/restart.txt`
