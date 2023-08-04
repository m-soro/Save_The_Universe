/**
 * --------------
 * DOM SELECTORS
 * --------------
 */
let hero = document.querySelector(".playerImage");
let enemy = document.querySelector(".enemyImage");
let heroName = document.querySelector(".player");
let enemyName = document.querySelector(".enemy");
let messageContainer = document.querySelector(".message-container");
let messageDiv = document.querySelector(".message");
let bodyContainer = document.querySelector(".bodyContainer");
/**
 * ----------------------------------------
 * FUN GIFS DISPLAYS AFTER YOU WIN OR LOSE
 * ----------------------------------------
 */
let winUrl =
  "https://media4.giphy.com/media/3IcEq6Cq9R9ErPoZIK/200w.gif?cid=790b7611roxssx9wfpzcjzhl154rjqiehhbuzasdtwa723r8&ep=v1_gifs_search&rid=200w.gif&ct=g";
let loseUrl = "https://media.tenor.com/jL6Frsqda74AAAAC/game-over.gif";
let explodeGif =
  "https://64.media.tumblr.com/be7d736a22463bab1d67e611d864b5bd/tumblr_mlhg9xoGMm1sn65iqo1_r1_500.gif";
let congratsGif =
  "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExcm94c3N4OXdmcHpjanpobDE1NHJqcWllaGhidXphc2R0d2E3MjNyOCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/RtpmUzMbynBeCgEa5E/200.gif";

/**
 * --------------------------
 * CREATE CAST OF CHARACTERS
 * --------------------------
 * One hero and Six enemy
 * Hero has: hull - 20, firepower - 5, accuracy - .7
 * Enemy has: hull - between 3 and 6, firepower - between 2and 4, accuracy - between .6and .8
 */

/**
 * ------------
 * SHIPS CLASS
 * ------------
 * Hero Ship and Enemy Ship inherits from Ships class.
 * It has one useful method - attack()
 */

class Ships {
  constructor(type, hull, firepower, accuracy) {
    this.type = type;
    this.hull = hull;
    this.firepower = firepower;
    this.accuracy = accuracy;
    this.getType = this.getType.bind(this);
    this.attack = this.attack.bind(this);
  }
  getType() {
    console.log(this.type);
  }

  /**
   * Attack method's parameter takes an enemy to be attacked
   * The method returns boolean isSuccessful, which determines whos turn it is
   * to attack.
   */
  attack(enemy) {
    let attackIsSuccessful = true;
    const pTag = document.createElement("p");

    if (Math.random() < this.accuracy) {
      enemy.hull -= this.firepower;

      pTag.innerText = `${this.type} attacked ${enemy.type}!.${this.type}'s firepower is ${this.firepower}. 
      \n${enemy.type} hull is now: ${enemy.hull}.`;
      messageDiv.appendChild(pTag);
      attackIsSuccessful = true;
    } else {
      pTag.innerText = `${this.type} has missed ${enemy.type}`;
      messageDiv.appendChild(pTag);
      attackIsSuccessful = false;
    }
    console.log(`${this.type} success of attack : ${attackIsSuccessful}`);
    return attackIsSuccessful;
  }
}

/**
 * ---------------------
 * HERO AND ENEMY SHIPS
 * ---------------------
 * Hero is the same as the Ships class.
 * Enemy has random property values using the genRand function.
 */

class Hero extends Ships {
  constructor(type, hull, firepower, accuracy) {
    super(type, hull, firepower, accuracy);
  }
}

class Enemy extends Ships {
  constructor(type, hull, firepower, accuracy, image) {
    super(type, hull, firepower, accuracy, image);
    this.type = "Alien";
    this.hull = Math.floor(genRand(3, 6));
    this.firepower = Math.floor(genRand(2, 4));
    this.accuracy = genRand(0.6, 0.8).toFixed(1);
  }
}

/**
 * -----------------------------------
 * FUNCTION FOR RANGED RANDOM NUMBERS
 * -----------------------------------
 */
const genRand = (start, end) => Math.random() * (end - start) + start;
/**
 * -------------------------------
 * FUNCTION TO CREATE ENEMY ARRAY
 * -------------------------------
 */
const createEnemies = (count) => {
  let enemyArray = [];
  for (let i = 1; i <= count; i++) {
    enemyArray.push(new Enemy());
  }
  return enemyArray;
};

/**
 * ----------------
 * THE GAME OBJECT
 * ----------------
 */

const Game = {
  myShip: new Hero("Hero", 20, 5, 0.7),
  aliens: createEnemies(6),
  isHeroTurn: true,
  playerElements: [hero, enemy],
  abortGame: () => {
    if (Game.isHeroTurn === true) {
      let ans = prompt("You hit an alien ship!, abort mission?", "no");
    } else {
      window.alert("Game Over");
      Game.restart();
    }
  },
  changeColor: (char) => (char.style.border = "8px solid red"), //styling function
  removeColor: (char) => (char.style.border = "none"), //styling function
  changeBgImage: (char, url) => (char.style.backgroundImage = `url(${url})`), //styling function
  getPlayerName: () => {
    let myName = prompt("What's your name?", "Schwarzenegger");
    heroName.innerText = `USS ${myName ?? "Raider"}`;
    return heroName;
  },
  /**
   * Update all the stats in UI enemy count, enemy and hero stats
   */
  updateStats: (shipType) => {
    const heroStats = document.querySelector(".playerStats");
    const enemyStats = document.querySelector(".enemyStats");
    const enemyNameBox = document.querySelector(".enemy");
    enemyNameBox.innerText = `Aliens left: ${Game.aliens.length}`;
    const ul = document.createElement("ul");

    for (let property in shipType) {
      //prettier-ignore // iterate through the objects property to display
      if (
        property === "hull" ||
        property === "firepower" ||
        property === "accuracy"
      ) {
        const list = document.createElement("li");
        list.innerText = `${property}: ${shipType[property]} `;
        ul.appendChild(list);
      }
      //prettier-ignore // if the ship is hero append to hero, if not append to enemy
      shipType === Game.myShip
        ? heroStats.replaceChildren(ul)
        : enemyStats.replaceChildren(ul);
    }
  },
  /**
   * This is just a bundle of of updateStats, since I have to update myship and aliens at the same time
   */
  updateAllStats: () => {
    Game.updateStats(Game.myShip);
    Game.updateStats(Game.aliens[0]);
  },
  /**
   * Instead of a while loop to restart the game. I'm reloading the page with 5 second delay
   * to see the win or lose graphics.
   */
  restart: () => setTimeout(() => document.location.reload(), 5000),
  /**
   * Checks the status of the game, based on enemy array length and hero ship hull.
   * Updates the UI based on these conditions and asks if player wants to re-start
   * which calls the restart function
   */
  checkGameStatus: () => {
    if (Game.aliens.length === 0) {
      const pTag = document.createElement("p");
      pTag.innerText = "GOOD GAME CAPTAIN!";
      messageDiv.appendChild(pTag);
      //prettier-ignore
      answer = prompt(`Captain ${heroName.textContent}, WON this battle! Play again?`,"yes");
      Game.changeBgImage(enemy, explodeGif);
      Game.changeBgImage(hero, congratsGif);
      Game.changeBgImage(bodyContainer, winUrl);
      answer === "yes" ? Game.restart() : window.alert("Game Over");
    } else if (Game.myShip.hull <= 0) {
      answer = prompt("ALIENS WIN! Play again?");
      Game.changeBgImage(bodyContainer, loseUrl);
      answer === "yes" ? Game.restart() : window.alert("Game Over");
    }
  },
  /**
   * Initiates the game play. First it updates the stats, then after 1 second delay
   * will prompt for the players name. If no delay. Stat boxes will not be loaded. Prompt is too fast.
   * Both the hero and enemy has event listeners, technically anywhere you click you will get the same action.
   * The red border that moves between two characters mimicks a prompt for a click.
   *
   * Before the start of the attack the aliens array is filtered to remove the "dead alien".
   * All characters has an attack method, this attack method returns whose turn it is to attack.
   * Based on this result the red border "moves" on whose attacking. After this is determined
   * After each attack, Game status is checked and UI is updated based on the attack.
   */
  play: () => {
    Game.updateAllStats();
    setTimeout(() => Game.getPlayerName(), 1000);
    Game.playerElements.forEach((playerElement) => {
      playerElement.addEventListener("click", (event) => {
        messageDiv.innerText = "";
        const enemyImage = document.querySelector(".enemyImage");
        //prettier-ignore
        enemyImage.style.backgroundImage = `url("./images/enemy${Math.floor(genRand(1, 6))}.gif")`;

        Game.aliens = Game.aliens.filter((alien) => alien.hull > 0);

        if (Game.aliens.length > 0) {
          // Game.abortGame(); // This is disruptive, but it works.
          Game.isHeroTurn = Game.myShip.attack(Game.aliens[0]);
          //prettier-ignore
          console.log(`If Hero hits determine if hero wants to abort game. Hit: ${Game.isHeroTurn}.`);
          if (Game.isHeroTurn === false) {
            Game.changeColor(hero);
            Game.removeColor(enemy);
            Game.isHeroTurn = Game.aliens[0].attack(Game.myShip);
          } else if (Game.isHeroTurn === true) {
            // Game.abortGame(); // This is disruptive, but it works.
            Game.changeColor(enemy);
            Game.removeColor(hero);
          }
        }

        Game.checkGameStatus();
        Game.updateAllStats();
        const pTag = document.createElement("p");
        pTag.innerText = `Aliens left: ${Game.aliens.length}`;
        messageDiv.appendChild(pTag);

        console.log(`Aliens left: ${Game.aliens.length}`);
      });
    });
  },
};

Game.play();
