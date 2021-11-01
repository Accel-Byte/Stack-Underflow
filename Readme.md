# Stack Underflow
> #### Question Answering site based on Node and React (MERNG Stack). [[Demo]](https://serene-yonath-36895b.netlify.app/)

## Snapshots
### HomePage
  ![HomePage](https://github.com/Accel-Byte/Stack-Underflow/blob/main/Images/HomePage.png?raw=true)
  <br />

### Dashboard
  ![Dashboard](https://github.com/Accel-Byte/Stack-Underflow/blob/main/Images/Dashboard.png?raw=true)
  <br />
 
### UploadImage
  ![UploadImage](https://github.com/Accel-Byte/Stack-Underflow/blob/main/Images/UploadImage.png?raw=true)
  <br />

### Register
  ![Register](https://github.com/Accel-Byte/Stack-Underflow/blob/main/Images/SignUp.png?raw=true)
  <br />
  
### SinglePost
  ![SinglePost](https://github.com/Accel-Byte/Stack-Underflow/blob/main/Images/SinglePost(1).png?raw=true)
  <br />

## Features
- [x] Authentication and Authorization (includes Email verification)
- [x] Create Question
- [x] Create Answer
- [x] Upvote Downvote Question and Answer
- [x] Create Comment
- [x] Filter questions based on tags
- [x] Serverside Pagination
- [x] Search Question
- [x] Dashboard for basic Statistics
- [x] Featured Posts
- [ ] Forgot password
- [ ] User Points
- [ ] Recommanded questions
- [ ] Upvote Downvote comments
- [ ] Two-factor authentication
- [ ] OAuth login with Google, Facebook, and Github
- [ ] Answer Accepted
- [ ] Specific blogs for posts and tutorials

## Prerequisite
+ Node.js

## Env Variables
Edit a .env file in client folder
```
REACT_APP_BACKEND_URL = "your backend url"
REACT_APP_WEBSOCKET = "your backend websocket"
```
For Example
```
REACT_APP_BACKEND_URL = "http://localhost:5000"
REACT_APP_WEBSOCKET = "ws://localhost:5000"
```
Create a config.js file in server folder and add the following
### Make Sure to connect to gmail api at google developer console
```
module.exports = {
    MONGODB = your mongo url
    SECRET_KEY = your JWT token
    EMAIL_ID = your email Id 
    PASSWORD = password for email Id
    EMAIL_SECRET = your email secret
    CLIENT_ID = your client Id
    CLIENT_SECRET = your client secret
    REDIRECT_URI = https://developers.google.com/oauthplayground
    REFRESH_TOKEN = your refresh token
};
```

## Setup Locally

```bash
git clone https://github.com/Accel-Byte/Stack-Underflow.git
cd stack-underflow
```
### Client
```bash
cd client
npm install
npm start
```

### Server
```bash
cd server
npm install
npm run serve
```

🎉 And that's it! You will now be able to visit <a href="http://localhost:3000/">http://localhost:3000/</a> URL and see your application up and running.


## Thanks
+ I'd appreciate a star if you find this helpful.


## License

[MIT](http://opensource.org/licenses/MIT)

