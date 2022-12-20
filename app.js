const express = require('express');

// express app:
const app = express();

// register view engine (ejs): (kigger automatisk i views folder)
app.set('view engine', 'ejs');
// eller custom folder fx.:
//app.set('views', 'myEjsViews');

const { json } = require('express');
// MONGO:
const { MongoClient, ServerApiVersion } = require('mongodb');

//mongoose:
const mongoose = require('mongoose');
const { insertMany } = require('./models/Player');

// Player:
const Player = require('./models/Player');

// mongo database connection string:
const dbURI = 'mongodb+srv://user1:1234@cluster0.1kjeku1.mongodb.net/test?retryWrites=true&w=majority';
  
mongoose.connect(dbURI)
 .then((result) => app.listen(3000))
 .catch((err) => console.log(err));

//Middleware and static files. static gør at filer i den tildelte mappe public kan tilgås
// http://localhost:5500/images/logo.png
app.use(express.static('public'));
app.use(express.json());

// Global playerIDs:
let playerIDs = [];

async function addPlayer(players){
console.log("incomming players:", players);
//rename:
 let playersObj = [];
 for (let i = 0; i < 4; i++) {
  let player = new Player(players[i]);
  if (player.username != null) {
   playersObj.push(player);
  };
 };
 console.log("playersObj:", playersObj);
 await savePlayersToMongoDB(playersObj);
};

async function savePlayersToMongoDB(playersObj){
 let i = 0;
 try {
  let players = await Player.insertMany(playersObj);
  // Refac ? ID'erne er globale?? Kan ikke fanges med i.... find anden metode/struktur?
  
  players.forEach(player => {
   console.log("player._id",player._id)
   playerIDs[i] = player._id;
   i++;
  });

 } catch(err) {
   console.log(err);
 };
 console.log("playerIDs",playerIDs)
};

async function deleteAllPlayers(){
 try {
  await Player.remove();
 } catch(err) {
   console.log(err);
 };
};

async function getTop10Players(){
 try {
  let result = await Player.find().sort({points: -1}).limit(10);
  return result;
 } catch(err) {
  console.log(err);
 };
};

// For testing:
// exports.getTop10Players = getTop10Players;

async function checkIfCurrentPlayerIsInTop10(){
 let place = 1;
 let places = [];
 try {
  let players = await getTop10Players();
  players.forEach(player => {
   for (let i = 0; i < 4; i++) {
    if (player._id.equals(playerIDs[i])) {
     places[i] = place;
    };
   };
   place++;
  });
   return places
 } catch (e) {
  console.log(e);
 };
};

async function getAllPlayers(){
 try {
  let players = await Player.find().sort({points: 1});
  console.log("antal spillere i db:", players.length)
  return players;
 } catch(err) {
  console.log(err);
 };
};

async function checkCurrentPlayerRanks(){
 let place = 1;
 let placesAndPlayersObj = [];
 try {
  let players = await getAllPlayers();
  players.forEach(player => {
   for (let i = 0; i < 4; i++) {
    if (player._id.equals(playerIDs[i])) {
     // Kunne jeg have gemt en ekstra property direkte i player-objektet...?
     // Måske det bedste er at gøre det allerede fra Player modellen?
     placesAndPlayersObj[i] = {place: place, playerObj: player};
    };
   };
   console.log("placesAndPlayersObj",placesAndPlayersObj)
   place++;
  });

  return placesAndPlayersObj;

 } catch (e) {
  console.log(e);
 };
};
 
app.get('/', (req, res) => {
 res.render('index', {title: 'Forside'});
});

app.get('/tableVeiw', (req, res) => {
    res.render('tableVeiw', { title: 'Game on!' });
});

app.get('/gamemenu', (req, res) => {
 res.render('gamemenu', {title: 'Menu'});
});

app.get('/scoreboardInfo', async function(req, res) {
 const data = await getTop10Players();
 res.status(200).json(data);
});

app.get('/playerRanks', async function(req, res) {
 const data = await checkIfCurrentPlayerIsInTop10();
 res.status(200).json(data);
});

app.get('/allPlayerRanks', async function(req, res) {
 const data = await checkCurrentPlayerRanks();
 res.status(200).json(data);
});

app.post('/savePlayerData', async function(req, res) {
 if(!req.body) {
  res.status(400).send({status: 'failed'});
 };
 await addPlayer(req.body);
 res.status(200).send({status: 'recieved'});
});

app.get('/scoreboard', (req, res) => {
 res.render('scoreboard', {title: 'Scoreboard'});
});

app.get('/clearScoreboard', async function(req, res) {
 console.log("running clear on server");
 await deleteAllPlayers();
 // + refresh hvis man er på scoreboard-siden, når man vælger at cleare?
});


// Denne bruges når ingen andre sider matches med ovenstående: (skal derfor stå til sidst.)
app.use((req, res) => {
 res.status(404).render('404', {title: 'Fejl'});
});