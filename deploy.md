# 🚀 Ticky Global - VPS Deployment Guide

Welcome! This guide will walk you through deploying your Ticky Global application on your AlmaLinux VPS manually from scratch. Since you have `root` access and are deploying this without cPanel, we will be using the industry-standard stack for a production Node.js application: **Node.js, MySQL, PM2, and Nginx**.

---

## 🛑 Step 0: Point Your Domain (Do this right away)
Before proceeding with Nginx and SSL setup later on, you need to point your domain to your VPS. 
1. Log in to your domain registrar (e.g., GoDaddy, Namecheap).
2. Go to your DNS Settings.
3. Add an **A Record**:
   * **Host/Name:** `@`
   * **Value/IP:** `92.205.187.233`
4. Add another **A Record** (for www):
   * **Host/Name:** `www`
   * **Value/IP:** `92.205.187.233`

*DNS propagation can take a little time, so doing this first ensures it's ready when we need it in Step 7.*

---

## 🛠️ Step 1: Install System Dependencies
First, log in to your server via SSH as the `tickyglobal` user. Since your user has `sudo` privileges, you can run commands as `root`. We need to install Node.js (v20), Git, Nginx, and MySQL.

Run these commands one by one:

```bash
# Update the system packages
sudo dnf update -y

# Enable Node.js v20 module and install Node.js and Git
sudo dnf module enable nodejs:20 -y
sudo dnf install -y nodejs git nginx mysql-server

# Install PM2 globally (PM2 keeps your app running forever in the background)
sudo npm install -g pm2
```

---

## 🗄️ Step 2: Setup Local MySQL Database
Your app requires a database. Let's start the MySQL server and create a database.

**1. Start & Enable MySQL:**
```bash
sudo systemctl start mysqld
sudo systemctl enable mysqld
```

**2. Secure your MySQL Installation (Optional but Recommended):**
```bash
sudo mysql_secure_installation
```
*(Just follow the on-screen prompts to set a root password and remove test databases. Press `Y` for yes on most of them).*

**3. Create the Database and User:**
Log into MySQL:
```bash
sudo mysql
```

Once inside the MySQL prompt (`mysql>`), run the following SQL commands one by one. **Important: Change `YourStrongPassword` to a secure password you want to use.**

```sql
CREATE DATABASE tickyglobal;
CREATE USER 'tickyuser'@'localhost' IDENTIFIED BY 'YourStrongPassword';
GRANT ALL PRIVILEGES ON tickyglobal.* TO 'tickyuser'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

## 📥 Step 3: Clone Your Codebase
Now, we will pull your code from your new GitHub repository into a directory on your server. A good place to put web applications is `/var/www/`.

```bash
# Create the www directory if it doesn't exist, and take ownership of it
sudo mkdir -p /var/www
sudo chown -R tickyglobal:tickyglobal /var/www

# Navigate to the folder
cd /var/www

# Clone the repository (It will ask for your GitHub credentials or SSH key password)
git clone git@github.com:FyslAhmd/ticky-global.git

# Go into the project folder
cd ticky-global
```

---

## ⚙️ Step 4: Configure Environment Variables
Your app needs to know how to connect to the database and your AWS S3 bucket.

1. Create your `.env` file by copying the example:
```bash
cp .env.example .env
```

2. Open the file in the `nano` text editor:
```bash
nano .env
```

3. Set your environment variables. Make sure your `DATABASE_URL` matches the user and password you created in Step 2. Also, add your AWS S3 credentials if your application utilizes them for file storage.
```env
# Database Connection (Format: mysql://USER:PASSWORD@localhost:3306/DATABASE)
DATABASE_URL=mysql://tickyuser:YourStrongPassword@localhost:3306/tickyglobal

# Set to production mode
NODE_ENV=production
PORT=3000

# AWS S3 Variables (Replace with your actual AWS keys)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_S3_BUCKET=your_bucket_name
```
*(To save and exit nano: Press `Ctrl + O`, then `Enter`, then `Ctrl + X`).*

---

## 🏗️ Step 5: Install & Build the Application
Now, we will install the Node.js packages, push the database structure to MySQL, and build the final production files.

```bash
# 1. Install all dependencies
npm install

# 2. Push the database schema to your local MySQL database
npm run db:push

# 3. Build the frontend and backend for production
npm run build
```

---

## 🚀 Step 6: Start the Application with PM2
We want the app to run in the background and automatically restart if it crashes or if the VPS reboots.

```bash
# Start the app using PM2
pm2 start dist/boot.js --name "ticky-global"

# Save the PM2 process list so it remembers the app
pm2 save

# Generate a startup script (Run this and follow the instructions it outputs)
pm2 startup
```
*Note: The `pm2 startup` command will print a command at the bottom of the screen that looks like `sudo env PATH=$PATH...`. You must copy and paste that command and press enter to ensure the app starts when the server reboots.*

---

## 🌐 Step 7: Configure Nginx (Reverse Proxy)
Right now, your app is running on port `3000` (e.g., `http://92.205.187.233:3000`). We need to use Nginx to route normal web traffic (port 80) from `tickyglobal.com` directly to your app.

**1. Create a new Nginx configuration file:**
```bash
sudo nano /etc/nginx/conf.d/tickyglobal.com.conf
```

**2. Paste the following configuration:**
```nginx
server {
    listen 80;
    server_name tickyglobal.com www.tickyglobal.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```
*(Save and exit nano: `Ctrl + O` -> `Enter` -> `Ctrl + X`)*

**3. Test and restart Nginx:**
```bash
sudo nginx -t
sudo systemctl enable nginx
sudo systemctl restart nginx
```

If your domain (Step 0) has propagated successfully, you should now be able to go to `http://tickyglobal.com` and see your app!

---

## 🔒 Step 8: Install SSL Certificate (HTTPS)
Finally, let's secure the website with a free SSL certificate from Let's Encrypt.

```bash
# Install EPEL repository and Certbot
sudo dnf install epel-release -y
sudo dnf install certbot python3-certbot-nginx -y

# Run Certbot to install the SSL certificate
sudo certbot --nginx -d tickyglobal.com -d www.tickyglobal.com
```

Certbot will ask for your email address and whether you agree to the Terms of Service. It will then automatically configure Nginx to use HTTPS and set up automatic renewals.

---

### 🎉 Congratulations!
Your website is now deployed, running in the background securely, served by Nginx, and secured with SSL! 

**Useful Commands for the Future:**
* To view live logs of your app: `pm2 logs ticky-global`
* To restart your app after code changes: `pm2 restart ticky-global`
* To update your app later: `git pull`, then `npm run build`, then `pm2 restart ticky-global`
