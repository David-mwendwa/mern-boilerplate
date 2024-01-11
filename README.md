# MERN Boilerplate

This is full stack boilerplate with React, Redux, Express, Mongoose and Passport.

## Features

- Server

  - Full CRUD REST API operations for User, Product, Order and Mpesa models
  - Passport authentication with local `email/password`, Facebook and Google OAuth strategies and JWT protected APIs
  - `User` and `Admin` roles
  - `async/await` syntax across whole app
  - Single `.env` file configuration
  - Image upload with Multer and cloudinary
  - Database seed

- Client

  - React client with functional components and Hooks
  - Redux state management with Thunk for async actions
  - Home, Users, Profile, Admin, Notfound, Login and Register pages
  - Protected routes with Higher order components
  - Different views for unauthenticated, authenticated and admin user
  - Admin has privileges to edit and delete
  - Layout component, so you can have pages without Navbar
  - Loading states with Loader component
  - config files within `/constants`

## Installation

1) `git clone <this_url> && cd <repo_name>`

2) `npm install`

3) Running the application
   - Development mode (client only): `npm run client`
	- Development mode (server only): `npm run server`
   - Production Bundle (Client only): `npm run build` then import the client code somewhere

## Usage

A good place to start would be the .env files. Copy `.env.default` in the root of the project and name the copy `.env`. Replace the values as you see fit. After that, you should be in a good place to start customizing it.

### Server

#### .env file

Rename `.env.default` to `.env` and fill in database connection strings, Google and Facebook tokens, JWT secret and your client and server production URLs.

```
# Database
MONGO_URL=mongodb+srv://<username>:<password>@cluster0-abcd.mongodb.net/test?retryWrites=true&w=majority

# Auth
JWT_SECRET=jXn2r5u8x/A?D*G-KaPdSgVkYp3s6v9y
JWT_LIFETIME=1d
COOKIE_LIFETIME=7

# Mpesa
MPESA_SHORTCODE=174379
MPESA_PASSKEY=bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919
MPESA_SECRET_KEY=null
MPESA_CONSUMER_KEY=null
MPESA_OAUTH_TOKEN_URL=https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials
LIPA_NA_MPESA_URL=https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest

# Nodemailer
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_EMAIL=null
SMTP_PASSWORD=null
SMTP_FROM_EMAIL=noreply@<appname>.com
SMTP_FROM_NAME=appname

# Cloudinary
CLOUDINARY_CLOUD_NAME=null
CLOUDINARY_API_KEY=null
CLOUDINARY_API_SECRET=null

# Stripe
STRIPE_SECRET_KEY=sk_test_...
```

#### Install dependencies

```
$ cd server
$ npm install
```

#### Run the server

You are good to go, server will be available on `https://localhost:5000`

```
$ npm run server
```

### Client

Just install the dependencies and run the dev server. App will load on `https://localhost:3000`.

```
$ cd client
$ npm install
$ npm start
```

## Deployment on Heroku

#### Push to Heroku

This project is already all set up for deployment on Heroku, you just need to create Heroku application add heroku remote to this repo and push it to `heroku` origin.

```
$ heroku login
$ heroku create <app-name>
$ git remote add heroku https://git.heroku.com/<app-name>.git
$ git push heroku master
$ heroku open
```

#### Database setup

But before that you need MongoDB database, so go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas), create cluster, whitelist all IPs and get database URL. Set that URL in `.env` file as `MONGO_URL`.

```
MONGO_URL=mongodb+srv://<username>:<password>@cluster0-abcd.mongodb.net/test?retryWrites=true&w=majority
```

If you don't insert environment variables in Heroku manually via web interface or console you'll need to remove `.env` file from `server/.gitignore` and push it to Heroku. Never push `.env` file to development repo though.

```
...
#.env #comment out .env file
...
```

#### Installing dependencies

Before all this happens Heroku needs to install the dependencies for both server and client, `heroku-postbuild` script is meant for that. `NPM_CONFIG_PRODUCTION=false` variable is there to disable production environment while dependencies are being installed. Again `--prefix` flag is specifying the folder of the script being run. In this script we build our React client as well.

```
"heroku-postbuild": "NPM_CONFIG_PRODUCTION=false npm install --prefix server && npm install --prefix client && npm run build --prefix client"
```

### Client Setup

Before you push to production you'll need to set your URLs in `client/constants`. That's it.

```javascript
export const FACEBOOK_AUTH_LINK =
  'https://my-own-app.herokuapp.com/auth/facebook';
export const GOOGLE_AUTH_LINK = 'https://my-own-app.herokuapp.com/auth/google';
```

## Licence

### MIT
