function getSessionCategories() {
    
    console.log(sessionStorage.getItem("cat1"));
    console.log(sessionStorage.getItem("cat1name"));

    let categorie = [];

    categorie.push(sessionStorage.getItem("cat1name"));
    categorie.push(sessionStorage.getItem("cat2name"));
    categorie.push(sessionStorage.getItem("cat3name"));
    categorie.push(sessionStorage.getItem("cat4name"));
    categorie.push(sessionStorage.getItem("cat5name"));
    categorie.push(sessionStorage.getItem("cat6name"));
    categorie.push(sessionStorage.getItem("cat7name"));
    categorie.push(sessionStorage.getItem("cat8name"));
    categorie.push(sessionStorage.getItem("cat9name"));
    categorie.push(sessionStorage.getItem("cat10name"));
    categorie.push(sessionStorage.getItem("cat11name"));
    categorie.push(sessionStorage.getItem("cat12name"));

    let catH = document.getElementById("kategori");
    let catH2 = document.getElementById("kategoriTwo");

    catH.innerHTML = "";

    for (let i = 0; i < 6; i++) {
        catH.innerHTML += `<th>${categorie[i]}</th>`;
    };

    catH2.innerHTML = "";

    for (let i = 6; i < categorie.length; i++) {
        catH2.innerHTML += `<th>${categorie[i]}</th>`;
    };

}

function getPlayerNames() {
    let playerNames = [];
    for (let i = 1; i < 5; i++) {
        if (sessionStorage.getItem("player" + i) != null){
            playerNames.push(sessionStorage.getItem("player" + i));
        };
    };
    console.log(playerNames);
    return playerNames;
};

function getBuzzerKeys() {
    let buzzerKeys = [];

    for (let i = 1; i < 5; i++) {
        if (sessionStorage.getItem("buzzer" + i + "Label") != null) {
            buzzerKeys.push(sessionStorage.getItem("buzzer" + i + "Label"));
        };
    };
    return buzzerKeys;

};

function getPlayerPoints() {
    let playerPoints = [];
    for (let i = 1; i < 5; i++) {
        if (sessionStorage.getItem("pointsPlayer" + i) != null) {
            playerPoints.push(sessionStorage.getItem("pointsPlayer" + i));
        }
    };
    console.log("playerPoints", playerPoints);
    return playerPoints;
}

function getPlayers() {
    let playerNames = getPlayerNames();
    let buzzerKeys = getBuzzerKeys();
    let playerPoints = getPlayerPoints();

    let players = [];

    for (let i = 0; i < playerNames.length; i++) {
        players.push({
            id: (i + 1),
            name: playerNames[i],
            key: buzzerKeys[i],
            score: playerPoints[i]
        });
    }
    return players;
}



function pupulatePlayerNamesAndStartSelectPlayer() {
    
    let playernames = getPlayerNames();
    let buzzerKeys = getBuzzerKeys();
    let playerPoints = getPlayerPoints();

    let names = [];

    // -------- refactor --------// 

    names[0] = document.querySelector("#card1 .name p");
    names[1] = document.querySelector("#card2 .name p");
    names[2] = document.querySelector("#card3 .name p");
    names[3] = document.querySelector("#card4 .name p");

    let cards = [];

    cards[0] = document.getElementById("card1");
    cards[1] = document.getElementById("card2");
    cards[2] = document.getElementById("card3");
    cards[3] = document.getElementById("card4");

    for (let i = 0; i < cards.length; i++) {
        cards[i].classList.add("card-hide");
    }

    buzzers = [];

    buzzers[0] = document.querySelector("#card1 .button p");
    buzzers[1] = document.querySelector("#card2 .button p");
    buzzers[2] = document.querySelector("#card3 .button p");
    buzzers[3] = document.querySelector("#card4 .button p");

    let points = [];

    points[0] = document.querySelector("#card1 .points p");
    points[1] = document.querySelector("#card2 .points p");
    points[2] = document.querySelector("#card3 .points p");
    points[3] = document.querySelector("#card4 .points p");

    for (let i = 0; i < playernames.length; i++) {

        cards[i].classList.remove("card-hide");
        names[i].innerHTML = playernames[i];
        points[i].innerHTML = playerPoints[i];
        if(typeof buzzerKeys[i] !== "undefined"){
         if (buzzerKeys[i] == " ") {
          buzzers[i].innerHTML = "Space";
         } else {
          buzzers[i].innerHTML = buzzerKeys[i].toUpperCase();
         }
        };

    };


    const randomNumber = Math.round(Math.random() * (getPlayerNames().length - 1));
    cards[randomNumber].classList.add("card-selected");

    sessionStorage.setItem("currentPlayerIndex" , randomNumber);

    startingPlayer(cards[randomNumber].querySelector("div.name > p").innerHTML)

};

getSessionCategories();
pupulatePlayerNamesAndStartSelectPlayer();

function startingPlayer(player) {
    document.getElementById('startingPlayer').innerHTML = player + " starter spillet!";
};

sessionStorage.setItem("preventScoreboardRefresh", 0);
