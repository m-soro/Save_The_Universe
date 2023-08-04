let hero = document.querySelector(".playerImage");
let enemy = document.querySelector(".enemyImage");
let heroName = document.querySelector(".player");
let enemyName = document.querySelector(".enemy");
let messageContainer = document.querySelector(".message-container");
let messageDiv = document.querySelector(".message");
/**
 * --------------------------
 * CREATE CAST OF CHARACTERS
 * --------------------------
 * One hero and Six enemy
 * Hero has: hull - 20, firepower - 5, accuracy - .7
 * Enemy has: hull - between 3 and 6, firepower - between 2and 4, accuracy - between .6and .8
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

  changeColor: (char) => (char.style.border = "8px solid red"),
  removeColor: (char) => (char.style.border = "none"),
  getPlayerName: () => {
    let myName = prompt("What's your name?", "Schwarzenegger");
    heroName.innerText = `USS ${myName ?? "Raider"}`;
    return heroName;
  },
  updateStats: (shipType) => {
    const heroStats = document.querySelector(".playerStats");
    const enemyStats = document.querySelector(".enemyStats");
    const enemyNameBox = document.querySelector(".enemy");
    enemyNameBox.innerText = `Aliens left: ${Game.aliens.length}`;
    const ul = document.createElement("ul");

    for (let property in shipType) {
      //prettier-ignore
      if (property === "hull" || property === "firepower" || property === "accuracy") { 
        const list = document.createElement("li")
        list.innerText = `${property}: ${shipType[property]} `
        ul.appendChild(list)
    }
      //prettier-ignore
      shipType === Game.myShip? heroStats.replaceChildren(ul): enemyStats.replaceChildren(ul);
    }
  },

  updateAllStats: () => {
    Game.updateStats(Game.myShip);
    Game.updateStats(Game.aliens[0]);
  },

  restart: () => location.reload(),

  checkGameStatus: () => {
    if (Game.aliens.length === 0) {
      //prettier-ignore
      answer = prompt(`Captain ${heroName.textContent}, WON this battle! Play again?`, "yes");
      answer === "yes" ? Game.restart() : window.alert("Game Over");
    } else if (Game.myShip.hull <= 0) {
      answer = prompt("ALIENS WIN! Play again?");
      answer === "yes" ? Game.restart() : window.alert("Game Over");
    }
  },

  play: () => {
    Game.getPlayerName();
    Game.playerElements.forEach((playerElement) => {
      playerElement.addEventListener("click", (event) => {
        messageDiv.innerText = "";
        const enemyImage = document.querySelector(".enemyImage");
        //prettier-ignore
        enemyImage.style.backgroundImage = `url("./images/enemy${Math.floor(genRand(1, 6))}.gif")`;
        Game.updateAllStats();
        Game.aliens = Game.aliens.filter((alien) => alien.hull > 0);
        Game.updateAllStats();
        if (Game.aliens.length > 0) {
          Game.isHeroTurn = Game.myShip.attack(Game.aliens[0]);
          //prettier-ignore
          console.log(`If Hero hits determine if hero wants to abort game. Hit: ${Game.isHeroTurn}.`);
          if (Game.isHeroTurn === false) {
            Game.changeColor(hero);
            Game.removeColor(enemy);
            Game.isHeroTurn = Game.aliens[0].attack(Game.myShip);
          } else if (Game.isHeroTurn === true) {
            // Game.abortGame();
            Game.changeColor(enemy);
            Game.removeColor(hero);
          }
        }
        Game.checkGameStatus();
        const pTag = document.createElement("p");
        pTag.innerText = `Aliens left: ${Game.aliens.length}`;
        messageDiv.appendChild(pTag);
        console.log(`Aliens left: ${Game.aliens.length}`);
      });
    });
  },
};
Game.play();
