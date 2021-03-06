# anime-showdown
This project was built using React.js and has full CRUD implemented.The data and deployed site is hosted in firebase.

This is a game where a user can collect characters and fight bosses. A player needs to sign up with their own email/username and password in order to play. 

When the player first logs in, they are given a set number of character tokens which they can use to randomly draw characters from the locations page. The characters will then show on the Characters page. 

A player can delete characters but only when they have more than 4 total. They can use level up tokens to update and level up the stats of their characters. 

A player can choose 4 characters to be on their team. When the team members are selected, they can click the Battle! button to go to the boss selection page.

A player can choose a boss to fight and the battle will start. The attack button uses the combined team's AP and characters that are in the healer's class can heal the party.

If the player wins the battle, they are rewarded with more tokens to draw and level up characters.


### How to run this app

* This app has been deployed to firebase and can be viewed here: https://anime-showdown.firebaseapp.com/

### To run on localhost

* Once you have a clone of the project install the web dependencies in the terminal:
```sh
npm install
```
* Rename apiKeys.js.example file to apiKeys.js.
* Create a new project in Firebase and add your api keys to the apiKeys.js
* Run the server in the terminal:
```sh
npm start
```

## Screenshots

### Login Page
![login page](https://firebasestorage.googleapis.com/v0/b/anime-showdown.appspot.com/o/animeShowdownHome.png?alt=media&token=92838bad-7c56-4bf5-a220-eb1e3c27fe4f)

### Characters Page
![main page](https://firebasestorage.googleapis.com/v0/b/anime-showdown.appspot.com/o/characterPage.png?alt=media&token=a674047a-59f9-4954-90b5-20dfe9ee89d3)

### Locations Page
![locations page](https://firebasestorage.googleapis.com/v0/b/anime-showdown.appspot.com/o/LocationsPage.PNG?alt=media&token=a17c9d59-f032-4e56-933f-de994ca05956)

### Boss Selection Page
![boss page](https://firebasestorage.googleapis.com/v0/b/anime-showdown.appspot.com/o/bossPage.png?alt=media&token=4c8d9b3e-db0e-4590-8a7f-ead347f10428)

### Battle Page
![battle page](https://firebasestorage.googleapis.com/v0/b/anime-showdown.appspot.com/o/BattlePage.PNG?alt=media&token=a39fb0e6-ccc0-4e8c-ba83-1f2a30b596ea)


