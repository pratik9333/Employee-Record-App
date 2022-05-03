# Employee-Record-App

An app for employees of the world to track their employment history.

Server hosted on heroku 
- url - https://employee-record-management-app.herokuapp.com/api/v1/companies

Used miro for brainstorming the app flow
- url - https://miro.com/app/board/uXjVO46sWZg=/

You can clone the repo to your local machine and first have to install the packages using npm install.

After that if you have successfully install the packages, you have to create the .env file and include the following things,

1. Cloudinary

- For cloudinary, create a account there and fill the below details that can be get from user dashboard
- Variables
  - CLOUD_NAME
  - API_KEY
  - API_SECRET

2. Port
- Variables
   - PORT
   
3. Cookie Expires
- Variables
   - COOKIE_EXPIRES
 
4. JWT
- Variables
   - JWT_SECRET
   - JWT_EXPIRES

5. MongoDB URL
- Create a new cluster on mongodb atlas and provide the url for same
- Variables
  - DB_URL

6. Mail App Password
- You have to create mail app password from your google account to send the email to users
- Variables
  - MAIL_APP_PASSWORD

- After the successfull setup, try to run the app using npm run dev or npm start.

- If app runs successfully, you will see these following messages,
  - App is running at port eg - 4002
  - DB is connected successfully! 

Hurrah! you have successfully set up the application, now you can test the endpoints using the given postman api collections by importing in postman app. 
