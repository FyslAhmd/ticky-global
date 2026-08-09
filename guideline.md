# 🧪 Ticky Global - A to Z Testing Guideline

Since this project was built entirely by an AI, it is critical to thoroughly test its features to ensure the AI did not leave behind any broken logic, placeholder links, or disconnected database tables.

This guide will walk you through testing every layer of the application so you can confidently confirm it is 100% production-ready.

---

## 1. The Frontend (Visuals & Routing)
The frontend is built with **React** and **Vite**. You should verify that all pages load quickly and correctly on both desktop and mobile devices.

### ✅ Test Checklist:
- [ ] **Homepage Load:** Open `https://tickyglobal.com`. Does it load securely (HTTPS)? Are there any broken images or missing fonts?
- [ ] **Mobile Responsiveness:** Shrink your browser window to the size of a mobile phone. Does the navigation menu collapse into a hamburger menu? Does the text resize properly?
- [ ] **Navigation Links:** Click every link in the header and the footer. Do they route to real pages (e.g., About Us, Services, Contact) or do they hit a 404 error?
- [ ] **Console Errors:** Right-click anywhere on the page, click **Inspect**, and go to the **Console** tab. Are there any red errors (specifically CORS errors or missing asset errors)?

---

## 2. The Backend (API & tRPC)
The backend is built with **Node.js, Hono, and tRPC**. This connects the visual buttons you press to the database. 

### ✅ Test Checklist:
- [ ] **Submit an Enquiry:** Go to the Contact page (or wherever the lead capture form is). Fill out the form with test data (`test@test.com`) and hit Submit.
- [ ] **Success Message:** Did the form show a success message, or did it hang/throw an error?
- [ ] **Network Tab Check:** In your browser's Developer Tools (Inspect), go to the **Network** tab. When you submit the form, you should see a `POST` request to `/api/trpc/...`. Check that it returns a `200 OK` status.

---

## 3. The Database (MariaDB & Drizzle)
The application tracks analytics and saves form submissions into your MariaDB database. We need to verify data is actually being saved.

### ✅ Test Checklist:
- [ ] **Verify Pageviews:** The app is configured to track pageviews (as seen in the `analytics_events` table). Click around a few pages on the site.
- [ ] **Verify Data in Terminal:** Open your server terminal via SSH and check if the database caught your form submission and your page views:
  ```bash
  sudo mysql -u tickyuser -p tickyglobal
  ```
  *(Enter your database password)*
  
  Now run these SQL queries to check the data:
  ```sql
  -- Check if your contact form submission saved:
  SELECT * FROM enquiries; 
  
  -- Check if your page visits are tracking:
  SELECT * FROM analytics_events ORDER BY createdAt DESC LIMIT 10;
  ```
  If those tables return rows with your recent activity, the database connection is flawless!

---

## 4. Authentication (Kimi Auth)
Your `.env` file indicates the app integrates with an external OAuth provider (`auth.kimi.com`). 

### ✅ Test Checklist:
- [ ] **Login Flow:** Look for a "Login" or "Admin" button on the website. Click it. 
- [ ] **Redirects:** Does it correctly redirect you to the `auth.kimi.com` login portal?
- [ ] **Callback Success:** After logging in, does it redirect you back to `https://tickyglobal.com` and properly log you in (showing your user profile or admin dashboard)?

---

## 5. Storage (AWS S3)
If your app allows file uploads or hosts media assets via Amazon S3, you need to ensure the server has proper write access.

### ✅ Test Checklist:
- [ ] **File Upload:** Find a section of the app that allows you to upload an image (e.g., changing a profile picture, or submitting a file in the contact form). 
- [ ] **Upload Success:** Did the upload succeed without a 500 error?
- [ ] **Image Rendering:** Refresh the page. Does the image load from your S3 bucketURL? (You can verify by right-clicking the image -> Open image in new tab, and checking if the URL belongs to AWS).

---

## 🎉 Final Verdict
If you can submit a form, log in, and see data writing to your MariaDB tables via the terminal, the core infrastructure of your AI-generated app is rock solid!
