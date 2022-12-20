let synligeElementer = 2;
let minusButtons;
//REFAC:
function addPlayer ()  {
    
        let form1 = document.getElementById('spillerForm1');
        let form2 = document.getElementById('spillerForm2');
        let form3 = document.getElementById('spillerForm3');
        let form4 = document.getElementById('spillerForm4');
        
        if (window.getComputedStyle(form1).display === "none") {
            form1.style.display = "flex";
            document.getElementById('dividerForm1').style.display = "block";
            synligeElementer += 1;
            console.log("elementer: ", synligeElementer);
            checkNumberOfElements();

        } else if (window.getComputedStyle(form2).display === "none") {
            form2.style.display = "flex";
            document.getElementById('dividerForm2').style.display = "block";
            synligeElementer += 1;
            console.log("elementer: ", synligeElementer);
            checkNumberOfElements();

        } else if (window.getComputedStyle(form3).display === "none") {
            form3.style.display = "flex";
            document.getElementById('dividerForm3').style.display = "block";
            synligeElementer += 1;
            console.log("elementer: ", synligeElementer);
            checkNumberOfElements();

        } else if (window.getComputedStyle(form4).display === "none") {
            form4.style.display = "flex";
            synligeElementer += 1;
            console.log("elementer: ", synligeElementer);
            checkNumberOfElements();
        };
};

function removePlayer (element, divider) {
    element.style.display = "none";
    divider.style.display = "none";
    synligeElementer -= 1;
    console.log("elementer: ", synligeElementer);
    checkNumberOfElements();
};

function removePlayer4 (element) {
    element.style.display = "none";
    synligeElementer -= 1;
    console.log("elementer: ", synligeElementer);
    checkNumberOfElements();
};

function checkNumberOfElements () {
    let minusButtons = document.querySelectorAll('.minusButton');
    if (synligeElementer > 2) {
        minusButtons.forEach(button => {
            button.style.display = "block";
        });
    };

    if (synligeElementer <= 2) {
        minusButtons.forEach(button => {
            button.style.display = "none";
        });
    };

    if (synligeElementer == 4) {
        document.getElementById('plusknap').style.display = "none";
        document.getElementById('plusOverskrift').style.display = "none";
    };

    if (synligeElementer < 4) {
        document.getElementById('plusknap').style.display = "flex";
        document.getElementById('plusOverskrift').style.display = "block";
    };
};

