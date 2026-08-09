# 🚀 Ticky Global - cPanel/AlmaLinux Deployment Guide

Welcome! Since you are used to deploying manually on Ubuntu, AlmaLinux 10 with cPanel will feel a bit different. cPanel tightly controls the web server (Apache) and the database (MariaDB). 

Instead of fighting cPanel by installing Nginx or PM2, we are going to use **Phusion Passenger**. This is cPanel's native way of running Node.js apps. It integrates directly with Apache, meaning we don't need a reverse proxy, and it manages the background processes automatically (so no PM2 required!).

---

## 🛑 Step 0: Point Your Domain
If you haven't already, point your domain to the server so cPanel can issue an SSL certificate.
1. Go to your domain registrar (e.g., GoDaddy, Namecheap).
2. Add an **A Record** for `@` pointing to `92.205.187.233`.
3. Add an **A Record** for `www` pointing to `92.205.187.233`.

---

## 💾 Step 1: Create a Swap File (Memory Protection)
Your VPS only has 2GB of RAM. cPanel alone uses a large chunk of this. To prevent your Node application from crashing when it builds or receives traffic, we will add 2GB of "virtual memory" (Swap) on your hard drive.

Run these commands in your SSH terminal:
```bash
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Make the swap permanent so it survives a reboot:
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

---

## 🛠️ Step 2: Install Node.js & Passenger
Instead of using `apt` (Ubuntu), AlmaLinux uses `dnf`. We need to install the official cPanel packages for Node.js 22 and Passenger.

Run this command:
```bash
sudo dnf install -y ea-nodejs22 ea-apache24-mod-passenger ea-apache24-mod_env
```
*(This installs Node.js and tells Apache how to run Node apps).*

---

## 🗄️ Step 3: Setup the Database (Using Existing MariaDB)
Since cPanel already installed MariaDB, we just need to log in and create your database.

**1. Log into the database:**
```bash
sudo mysql
```

**2. Run these SQL commands:** *(Change `YourStrongPassword` to a secure password!)*
```sql
CREATE DATABASE tickyglobal;
CREATE USER 'tickyuser'@'localhost' IDENTIFIED BY 'YourStrongPassword';
GRANT ALL PRIVILEGES ON tickyglobal.* TO 'tickyuser'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

## 📥 Step 4: Clone & Build Your Codebase
In cPanel, your main website is served from the `public_html` directory. We will clone your code into a safe folder outside of that, and then link it later.

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
Update the database URL to match what you created in Step 3. (To save and exit nano: `Ctrl + O` -> `Enter` -> `Ctrl + X`).
```env
DATABASE_URL=mysql://tickyuser:YourStrongPassword@localhost:3306/tickyglobal
NODE_ENV=production
```

**3. Install & Build:**
```bash
# We must use the specific Node version we installed via cPanel
export PATH=/opt/cpanel/ea-nodejs22/bin:$PATH

# Install packages
npm install

# Push the database schema
npm run db:push

# Build the application
npm run build
```

---

## 🚀 Step 5: Connect the App to Apache (Passenger)
This is where the magic happens. We just need to drop a `.htaccess` file into your public web folder. Apache will read it and automatically boot up your Node.js application!

**1. Open your public HTML folder's `.htaccess` file:**
```bash
nano /home/tickyglobal/public_html/.htaccess
```

**2. Paste this exact configuration inside:**
```apache
PassengerEnabled On
PassengerAppType node
PassengerAppRoot /home/tickyglobal/ticky-global
PassengerStartupFile dist/boot.js
```
*(Save and exit nano: `Ctrl + O` -> `Enter` -> `Ctrl + X`).*

That's it! Passenger will automatically intercept traffic to `tickyglobal.com` and run your `dist/boot.js` app. It will also restart the app automatically if the server reboots.

---

## 🔒 Step 6: Secure with SSL (AutoSSL)
cPanel has a built-in feature called AutoSSL that automatically generates free Let's Encrypt certificates. You don't need to manually install Certbot like on Ubuntu.

Force cPanel to check your domain and install the SSL certificate by running:
```bash
sudo /usr/local/cpanel/bin/autossl_check --user=tickyglobal
```
*(Note: Your domain must be pointed to the server for this to work. It may take a few minutes to complete).*

---

### 🎉 You're Done!
Your application is now successfully running within the native cPanel ecosystem. It’s secure, memory-protected with swap, and managed automatically by Passenger.

**To restart your app in the future (after pulling new code):**
Passenger restarts your app whenever it sees a file called `restart.txt` inside a `tmp` folder.
```bash
mkdir -p /home/tickyglobal/ticky-global/tmp
touch /home/tickyglobal/ticky-global/tmp/restart.txt
```
