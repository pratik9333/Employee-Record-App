# Employee-Record-App

An app for employees of the world to track their employment history.

You can clone the repo to your local machine and first have to install the packages using npm install

After that if you have successfully install the app, you have to create the .env file and include the following things,

1. Cloudinary

- For cloudinary, create a account there and fill the above details that can be get from user dashboard
  CLOUD_NAME
  API_KEY
  API_SECRET

2. Port
   - PORT
3. Cookie Expires
   - COOKIE_EXPIRES
4. JWT

   - JWT_SECRET
   - JWT_EXPIRES

5. MongoDB URL

- Create a new cluster on mongodb atlas and provide the url for same
  - DB_URL

6. Mail App Password

- You have to create mail app password to send the email using your google account
  - MAIL_APP_PASSWORD
