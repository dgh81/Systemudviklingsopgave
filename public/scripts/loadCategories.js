// const { getVersion } = require("jest");

//Stjålet fra: https://bost.ocks.org/mike/shuffle/ og https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
 var m = array.length, t, i;
 // While there remain elements to shuffle…
 while (m) {
  // Pick a remaining element…
  i = Math.floor(Math.random() * m--);
  // And swap it with the current element.
  t = array[m];
  array[m] = array[i];
  array[i] = t;
 };
 return array;
};
// Hent data fra API via JSON
async function setupCategoryDropdowns() {
 sessionStorage.clear();
 console.log("running setupCategoryDropdowns");
 // Get data from API
 let data = await getDataFromAPI();
 // Byg categories med 60 kategorier:
 let categories = await buildCategories(data);
 // Randomize categories array:
 shuffle(categories);
 // Fill HTML dropdown fields:
 await fillDropdownsWithCategories(categories);
};

async function getDataFromAPI() {
 try {
  let randomCategoryOffset = Math.round(Math.random()*5400);
  let apiPath = `https://jservice.io/api/categories?count=100&offset=${randomCategoryOffset}`;
  const response = await fetch(apiPath);
  const data = await response.json();
  return data;
 } catch (e) {
  console.log(e);
  console.log("There was an error fetching the data");
 };
};

async function buildCategories(data){
 let categories = [];
 try {
  for (i = 0; categories.length < 60; i++){
    if (data[i].clues_count > 4){
     categories.push(data[i]);
    };
  };
  return categories;
 } catch (e) {
  console.log(e);
 };
};

async function fillDropdownsWithCategories(categories){
 try {
  for (let i = 0; i < 12; i++) {
   let choice = document.getElementById(`kategori${i+1}`);
   choice.innerHTML = "";
   choice.innerHTML += `<option value='default'>Vælg kategori</option>`;
   for (j = 0; j < 5; j++){
    let counter = (j)+i*5;
    let catTitle = categories[counter].title;
    catTitle = fixAsciiChars(catTitle);
    choice.innerHTML += `<option value=${categories[counter].id}>${catTitle}</option>`;
   };
  };
 } catch (e) {
  console.log(e)
 };
};

//Tilfældige kategorier
async function setupRandomCategories() {
 console.log("running randomCategories");
 try {
  let data = await getDataFromAPI();
  let categories = await buildCategories(data)
  shuffle(categories);
  await fillRemainingDropDownsWithCategories(categories);
 } catch (e) {
  console.log(e);
  console.log("There was an error fetching the data");
 };
};

async function fillRemainingDropDownsWithCategories(categories){
 let remainingCategoriIDs = await getRemainingCategoriIDs();
 for (let k = 0; k < remainingCategoriIDs.length; k++) {
  let choice = document.getElementById(`kategori${k+1}`);
  if (choice.id == remainingCategoriIDs[k]) {
   choice.innerHTML = "";
   choice.innerHTML += `<option value='default'>Vælg kategori</option>`;
   for (j = 0; j < 5; j++){
    if (choice.id != remainingCategoriIDs[i]) {
     let choice = document.getElementById(`kategori${k+1}`);
     //Fix forkerte character fra API:
     let catTitle = categories[j+k*5].title;
     if(catTitle == "inventions") {
      console.log("FOUND IT!!!!!!!!!");
      // 
     };
     catTitle = fixAsciiChars(catTitle);
     choice.innerHTML += `<option value=${categories[j+k*5].id}>${catTitle}</option>`;
    };
    console.log();
   };
  };
 };
};

async function getRemainingCategoriIDs(){
 let remainingCategoriIDs = [];
 try {
  for (let i = 0; i < 12; i++) {
   let choice = document.getElementById(`kategori${i+1}`);
   if (choice.value == "default" || choice.value == "") {
    remainingCategoriIDs[i] = choice.id;
   };
  };
 return remainingCategoriIDs;
 } catch (error) {
  console.log(error);
 };
};

function fixAsciiChars(string){
 //Mangler: chargÃ© d\'affaires (Fra kat: diploma"c") skal være é - ved ik med \ ?
 string = string.replaceAll("â", "'");
 string = string.replaceAll("Ã³", "ó");
 string = string.replaceAll("Ã©", "é");
 string = string.replaceAll("\\", "");
 string = string.replace(/\â|\x98|\x80/g, "");
 return string;
};

// helper - MIS.
// async function findCat() {
//  let randomCategoryOffset
//  for (let x = 0; x < 55; x++) {
//   randomCategoryOffset = x * 100;
//   try {
  
//   let apiPath = `https://jservice.io/api/categories?count=100&offset=${randomCategoryOffset}`;
//   const response = await fetch(apiPath);
//   const data = await response.json();

//   // console.log(data);
//   for (let i = 0; i < data.length; i++) {
//    if (data[i].title == "inventions")
//    console.log(data[i].title);
//    console.log(data[i].id);
//   }

//  } catch (e) {
//   console.log(e);
//   console.log("There was an error fetching the data");
//  };
//  }
 
// };

// findCat();