# Woordenquiz

You can try this app by visiting [WoordenQuiz](https://woordenquiz.duckdns.org/)

## Overview

**Woordenquiz** is an educational application for learning words designed to help users practise their Dutch language skills through repetition and quizzes.  
This application built with **Node.js**, **MongoDB** and **Vanilla JavaScript** (no frontend frameworks)
Users can register, log in, receive personalized word sets. Words are selected dynamically based on the user’s progress and learning stage.

## Usage

1.  **User Authentication**
    The user registers with a name, email and password. When logging in, a JWT token is provided, which is stored in localStorage.

2.  **Learning Process**  
    Words are provided in small sets. Each word goes through several stages as the user interacts with it. The words become new, familiar or learned depending on the user's quiz results.

3.  **Status After Learning Loop**  
    After completing a full learning loop, each word can have one of the following statuses: `new`, `familiar`, or `learned`.

    - If the user makes **no more than one mistake**, the word is considered **learned**, and its status becomes `learned`.
    - If the user makes **2 or 3 mistakes**, the word is considered **partially learned**, and it will appear again in the next loop along with new words, but starting from **stage 4**.
    - If the user makes **4 or 5 mistakes**, the word is considered **unknown**, its status remains `new`, and the user will learn it again from the beginning in the next loop.

## Getting the Data

- The app gets vocabulary data from a MongoDB collection of words (`words`).
- When a user logs in, their current set of words is fetched based on their ID.
- The backend ensures that each user receives new words if they have fewer than 10 "new" words in their set.
- All user interactions (e.g., answer attempts, stages, word statuses) are stored and updated in the user's document in the `users` collection.

**Database Structure:**

1.  **users:**

```
{
  _id: ObjectId,
  name: string,
  email: string,
  password: string (hashed),
  words: [
    {
      _id: ObjectId (from the `woorden` collection),
      status: 'new' | 'familiar' | 'learned',
      counter: number,
      stage: number
    }
  ],
  created_date: Date,
  lastView_date: Date
}
```

2. **words:**

```
{
  _id: ObjectId,
  front: string, // word in Dutch
  back: string   // translation in English
  category: number
}
```

3. **categories**

```
{
  _id: ObjectId,
  category: number,
  categoryName: string
}
```

## Tech Stack

### Client side

1. HTML
2. CSS
3. JavaScript

### Server side

1. Node.js
2. Express.js
3. MongoDB

### Deployment

1. AWS EC2
2. Nginx
3. PM2
4. Let’s Encrypt

### Third party service
1. Stripe

### Domain

https://woordenquiz.duckdns.org

## Structure of the project

```
Project structure:

├── README.md
├── package.json
├── package-lock.json
├── prettier.config.cjs
├── client
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── public
│   │   ├── favicon
│   │   │   └── favicon-32x32.png
│   │   └── style.css
│   ├── assets
│   │   ├── back.svg
│   │   └── icon-profile.svg
│   └── src
│       ├── app.js
│       ├── pages
│       │   ├── getWord.js
│       │   ├── loginFormPage.js
│       │   ├── registerFormPage.js
│       │   ├── userProfilePage.js
│       │   └── welcomePage.js
│       └── views
│           ├── backButton.js
│           ├── flashCardView.js
│           ├── generateFourAnswers.js
│           ├── generateTwoAnswers.js
│           ├── message.js
│           ├── nextWordButton.js
│           ├── nextWordSetPage.js
│           ├── quizCardView.js
│           └── userProfileButton.js
└── server
    ├── package.json
    ├── package-lock.json
    ├── server.js
    ├── controllers
    │   ├── users.js
    │   └── woorden.js
    ├── routes
    │   ├── users.js
    │   └── woorden.js
    ├── db
    │   └── connectDB.js
    └── documentation
        ├── userAPI_doc.yaml
        └── wordAPI_doc.yaml

```
