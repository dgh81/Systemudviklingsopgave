const mongoose = require('mongoose');
const Schema = mongoose.Schema;

console.log("test player object");
//opret Schema:
const playerSchema = new Schema({
 username: {
 type: String,
},
 points: {
 type: Number,
},
 opponent1: {
 type: String,
},
 opponent2: {
 type: String,
},
 opponent3: {
 type: String,
}
},
{timestamps: true});

// Opret model: brug Player object for at bruge Player i db!
const Player = mongoose.model('Player', playerSchema);
module.exports = Player;