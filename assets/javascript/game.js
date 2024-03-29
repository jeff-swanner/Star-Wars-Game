$(document).ready(function() {
    // Defines Characters
    var char1;
    var char2;
    var char3;
    var char4;
    var characters;
    var enemies;
    var selectedPlayer;
    var selectedDefender;
    var characterSelected;
    var defenderSelected;
    var gameOver;
    var APincrement;
    // Function Resets the game to initial state.
    function reset() { 
        char1 = {
            name: "R2D2",
            HP: 100,        // Health Points
            AP: 12,          // Attack Power
            CAP: 10,       // Counter Attack Power
            image: 'assets/images/R2D2.jpg',
            id: "char1"
        };
        char2 = {
            name: "Chewbacca",
            HP: 110,        // Health Points
            AP: 8,          // Attack Power
            CAP: 20,       // Counter Attack Power
            image: 'assets/images/Chewbacca.jpg',
            id: "char2"
        };
        char3 = {
            name: "Yoda",
            HP: 80,        // Health Points
            AP: 11,          // Attack Power
            CAP: 15,       // Counter Attack Power
            image: 'assets/images/Yoda.jpg',
            id: "char3"
        };
        char4 = {
            name: "Jaba the Hutt",
            HP: 125,        // Health Points
            AP: 6,          // Attack Power
            CAP: 25,       // Counter Attack Power
            image: 'assets/images/Jabba.jpeg',
            id: "char4"
        };
        characters = [char1,char2,char3,char4]; 
        enemies = [];
        selectedPlayer;
        selectedDefender;
        characterSelected = false;
        defenderSelected = false;
        gameOver = false;
        // Adds character Divs to selection area of HTML
        $("#characterSelection").empty();
        $("#characterSelection").append(characterImageGen(char1));
        $("#characterSelection").append(characterImageGen(char2));
        $("#characterSelection").append(characterImageGen(char3));
        $("#characterSelection").append(characterImageGen(char4));
        $("#chosenCharacterImage").empty();
        $("#enemiesImage").empty();
        $("#defenderImage").empty();
    };
    // Generates the individiual character div to send to HTML sections
    function characterImageGen(selectedPlayer) {
        var element = $('<div class="imgContainer">');
        element.text(selectedPlayer.name);
        element.attr("id",selectedPlayer.id);
        element.append("<img src=" + selectedPlayer.image + ">" + selectedPlayer.HP);
        return element;
    };
    // returns character object when a div is selected 
    function characterSelector(selectedPlayer) {
        var index = characters.findIndex(function(characters) {
            return characters.id === selectedPlayer;
        });
        selectedPlayer = characters[index];
        return selectedPlayer;
    };
    // Updates enemy array and adds enemies to the HTML section
    function enemyGen() {
        $("#enemiesImage").empty();
        enemies = [];
        for (i=0;i<characters.length;i++) {
            if (characters[i]!=selectedPlayer && characters[i].HP > 0) {
                enemies.push(characters[i]);
            };
        };
        if (defenderSelected) {
            enemies.splice(enemies.indexOf(selectedDefender),1);
        };
        for (i=0;i<enemies.length;i++) {
            $("#enemiesImage").append(characterImageGen(enemies[i]).css("background-color", "red"));
        };
    };
    // updates HTML if enemy defeated 
    function enemyDefeated(selectedPlayer) {
        $("#defenderImage").empty();
        $("#defenderImage").html("<p>You have defeated " + selectedPlayer.name + ", you can choose to fight another enemy.");
    };
    // Initial game reset
    reset(); 
    // Click event for characters
    $(document).on('click', '.imgContainer', function () {
        if (!gameOver) {
            // Selects player character and updates HTML, etc
            if (!characterSelected) {
                $("#characterSelection").empty();
                selectedPlayer = this.getAttribute("id");
                selectedPlayer = characterSelector(selectedPlayer);
                $("#chosenCharacterImage").html(characterImageGen(selectedPlayer));
                enemyGen();
                characterSelected = true;
                APincrement = selectedPlayer.AP;
            }
            // Selects defender character, updates html, etc
            else if (characterSelected && $(this).attr("id") != selectedPlayer.id) {
                selectedDefender = this.getAttribute("id");
                selectedDefender = characterSelector(selectedDefender);
                $("#defenderImage").html(characterImageGen(selectedDefender).css({"background-color": "black","color": "white"}));
                defenderSelected = true;
                enemyGen();
            };
        };
    });
    // Monitors attack button and updates character objects, html, etc
    $(document).on('click', '#attack', function () {
        if (!gameOver) {
            if (defenderSelected) {
                if (selectedDefender.HP > 0 && selectedPlayer.HP > 0) {
                    selectedDefender.HP -= selectedPlayer.AP;
                    var defenderDamage = selectedPlayer.AP;
                    selectedPlayer.AP += APincrement;
                    if (selectedDefender.HP <= 0) {
                        selectedDefender.HP = 0;
                        if (enemies.length === 0) {
                            $("#defenderImage").html("<p>YOU WIN!!! GAME OVER!!!");
                            $("#defenderImage").append('<button id="reset">Reset</button>');
                            gameOver = true;
                        } else {
                            enemyDefeated(selectedDefender);
                            defenderSelected = false;
                        };
                    } else {
                        $("#defenderImage").html(characterImageGen(selectedDefender).css({"background-color": "black","color": "white"}));
                        $("#defenderImage").append("<p>You attacked " + selectedDefender.name + " for " + defenderDamage + " damage.");
                        $("#defenderImage").append("<p>" + selectedDefender.name + " attacked you back for " + selectedDefender.CAP + " damage.")
                        selectedPlayer.HP -= selectedDefender.CAP;
                        $("#chosenCharacterImage").html(characterImageGen(selectedPlayer));
                        if (selectedPlayer.HP <= 0) {
                            selectedPlayer.HP = 0;
                            $("#chosenCharacterImage").html(characterImageGen(selectedPlayer));
                            $("#defenderImage").html("<p>You've been defeated. GAME OVER!!!");
                            $("#defenderImage").append('<button id="reset">Reset</button>');
                            // loseAnimation();
                            gameOver = true;
                        };
                    };
                }; 
            } else if (!defenderSelected) {
                $("#defenderImage").empty();
                $("#defenderImage").html("<p>No enemy here.</p>")
            };
        };
    });
    // Resets game on click
    $(document).on('click', '#reset', function () {
        reset();
    });
});