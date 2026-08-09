# 🚀 Ticky Global - Final cPanel/AlmaLinux Deployment Guide

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
Verify the swap is active by running `free -h`. You should see approximately `2.0Gi` of Swap.

---

## 🛠️ Step 2: Install Node.js & Passenger
We need to install the official cPanel EasyApache packages for Node.js 22 and Passenger.

```bash
sudo dnf install -y ea-nodejs22 ea-apache24-mod-passenger ea-apache24-mod_env
```
Verify installation: `/opt/cpanel/ea-nodejs22/bin/node -v`

---

## 🗄️ Step 3: Secure & Setup the Database
cPanel already installed MariaDB, but it might be listening publicly. We want it restricted to localhost.

**1. Locate the correct config file:**
Run this to see where `bind-address` might already be defined:
```bash
sudo grep -R "bind-address" /etc/my.cnf /etc/my.cnf.d/ 2>/dev/null
```
If it's missing, open the main config file:
```bash
sudo nano /etc/my.cnf.d/mariadb-server.cnf
```
Add this under `[mysqld]`:
```ini
bind-address = 127.0.0.1
```
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
*(Press Enter for all prompts to use the default path).*

**2. View and copy the public key:**
```bash
cat ~/.ssh/id_ed25519.pub
```
**3. Add to GitHub:** Go to your `ticky-global` repository on GitHub -> **Settings** -> **Deploy keys** -> **Add deploy key**. Paste the key you just copied.

**4. Test the connection:**
```bash
ssh -T git@github.com
```
*(You should see a successful authentication message).*

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

## 🏗️ Step 6: Build & Create Entry Point
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
By default, cPanel Passenger looks for an `app.js` file to start the application. Since our app is built into `dist/boot.js` (and is an ES module), we will create a literal `app.js` file that simply imports our built code. This is the cleanest, most explicit way to satisfy cPanel without messy symlinks or hacking Apache configs:
```bash
echo "import './dist/boot.js';" > app.js
```

---

## 🚀 Step 7: Register App via cPanel UAPI
Instead of manually writing `.htaccess` rules (which can cause conflicts), we will use cPanel's official API to register the application. Notice that the `path` is relative to your home directory.

Run this command:
```bash
uapi --output=jsonpretty \
  --user=tickyglobal \
  PassengerApps \
  register_application \
  name='tickyglobal' \
  path='/ticky-global' \
  domain='tickyglobal.com'
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
3. Tell Passenger to restart: `mkdir -p tmp && touch tmp/restart.txt`
