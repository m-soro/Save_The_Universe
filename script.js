let hero = document.querySelector(".playerImage");
let enemy = document.querySelector(".enemyImage");
let heroName = document.querySelector(".player");
let enemyName = document.querySelector(".enemy");
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
    if (Math.random() < this.accuracy) {
      enemy.hull -= this.firepower;
      console.log(
        `${enemy.type} is attacked by ${this.type}. ${this.type}'s firepower is 
        ${this.firepower}. ${enemy.type} hull is now: ${enemy.hull}.`
      );
      attackIsSuccessful = true;
    } else {
      console.log(`${this.type} has missed ${enemy.type}`);
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
  constructor(type, hull, firepower, accuracy) {
    super(type, hull, firepower, accuracy);
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
  isOn: true,
  playerElements: [hero, enemy],
  playerName: () => {
    let myName = prompt("What's your name?", "Schwarzenegger");
    heroName.innerText = `USS ${myName}`;
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

  play: () => {
    Game.playerName();
    Game.playerElements.forEach((playerElement) => {
      Game.updateStats(Game.myShip);
      Game.updateStats(Game.aliens[0]);
      playerElement.addEventListener("click", (event) => {
        Game.aliens = Game.aliens.filter((alien) => alien.hull > 0);
        if (Game.aliens.length > 0) {
          Game.isHeroTurn = Game.myShip.attack(Game.aliens[0]);
          if (Game.isHeroTurn === false) {
            enemy.style.border = " 5px solid red";
            hero.style.border = "none";
            Game.isHeroTurn = Game.aliens[0].attack(Game.myShip);
          } else if (Game.isHeroTurn === true) {
            enemy.style.border = "none";
            hero.style.border = "5px solid red";
          }
        }
        Game.updateStats(Game.myShip);
        Game.updateStats(Game.aliens[0]);

        if (Game.aliens.length === 0) {
          Game.isOn = false;
          answer = prompt("YOU WIN! Play again?", "yes");
          answer === "yes" ? Game.play() : window.alert("Game Over");
        } else if (Game.myShip.hull <= 0) {
          Game.isOn = false;
          answer = prompt("ALIENS WIN! Play again?");
          answer === "yes" ? Game.play() : window.alert("Game Over");
        }
        console.log(`Aliens left: ${Game.aliens.length}`);
      });
    });
  },
};

Game.play();
