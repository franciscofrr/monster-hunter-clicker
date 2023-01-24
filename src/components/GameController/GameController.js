import React from 'react';

import Player from '../Player/Player'
import Battle from '../Battle/Battle'
import HunterList from '../HunterList/HunterList';
import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import Map from '../Map/Map'

import monsters from '../../data/monsters.json'
import locations from '../../data/locations.json'

import './GameController.css'

class GameController extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        //ENUMS
        HUNTER_RANKS: ['Low Rank', 'High Rank', 'Master Rank', 'G-Rank'],
        WEAPON_TYPES: ['Bow', 'Charge Blade', 'Dual Blades', 'Great Sword', 'Gunlance', 'Hammer', 'Heavy Bowgun', 'Hunting Horn', 'Insect Glaive', 'Lance', 'Light Bowgun', 'Long Sword', 'Switch Axe', 'Sword and Shield'],
        //PLAYER
        playerGuildName: 'Hunter Guild',
        playerGuildRank: 1,
        playerGuildXp: 0,
        playerGuildXpToNextLevel: 100,
        playerGuildTotalHunts: 0,
        playerGuildMoney: 0,
        playerGuildPoints: 0,
        playerGuildHunters: [],
        playerGuildMonsterDrops: [],
        playerGuildDirectAttackPower: 1000,
        playerGuildCombinedHunterAttackPower: 0,
        playerGuildMoneyToHireNextHunter: 50,
        //MONSTER
        monsterName: '',
        monsterLevel: 1,
        monsterTotalHealth: 1,
        monsterCurrentHealth: 1,
        monsterSize: '',
        monsterDrops: [],
        monsterMoney: 1,
        monsterPoints: 1,
        monsterRankXp: 1,
        battleTimer: 1,
        clockId: null,
        //MAP
        mapLocations: locations,
        currentLocationName: '',
        currentLocationMonsters: [],
        currentLocationLevel: 1,
        totalLocationHunts: 0,
        currentLocationHunts: 0,
        currentLocationHuntsToNextLevel: 10
      }

      this.hunterAutoAttack = this.hunterAutoAttack.bind(this);
      this.changeCurrentLocation = this.changeCurrentLocation.bind(this);
      this.refreshMonster = this.refreshMonster.bind(this);
      this.handleDirectAttack = this.handleDirectAttack.bind(this);
      this.checkBattleEnd = this.checkBattleEnd.bind(this);
      this.hireHunter = this.hireHunter.bind(this);
      this.increaseMonsterHealth = this.increaseMonsterHealth.bind(this);
      this.increaseMonsterDrops = this.increaseMonsterDrops.bind(this);
      this.spawnMonster = this.spawnMonster.bind(this);
      this.countdownLargeMonsterBattle = this.countdownLargeMonsterBattle.bind(this);
      this.runCountdown = this.runCountdown.bind(this);
      this.resetClock = this.resetClock.bind(this);
    }
  
    componentDidMount() {
      setInterval(this.hunterAutoAttack, 1000);
      this.setState({
        battleTimer: 10
      })
    }

    componentDidUpdate() {
      if (this.state.monsterSize === "Large") {
        if (this.state.battleTimer <= 0) {

          //Stop timer after large monster battle
          this.resetClock();

          //Check if monster is still alive after timeout
          if (this.state.monsterCurrentHealth > 0) {
            this.setState({
              currentLocationHuntsToNextLevel: this.state.currentLocationHuntsToNextLevel + 10
            })
            this.refreshMonster();
          }
        }

        if (this.state.monsterCurrentHealth < 0) {
          //Defeated large monster - stop timer and check battle end
          clearInterval(this.state.clockId);
          this.checkBattleEnd();
        }
      } else {
        if (this.state.monsterCurrentHealth < 0) {
          //Defeated small monster
          this.checkBattleEnd();
        }
      }
    }

    changeCurrentLocation(locationName) {
      this.setState({
        currentLocationName: locations.find(location => location.name === locationName).name,
        currentLocationMonsters: locations.find(location => location.name === locationName).monsters,
        currentLocationHunts: 0
      }, () => {
        this.refreshMonster();
      })
    }

    spawnMonster(monsterSize) {
      const monsterList = monsters
        .filter(monster => this.state.currentLocationMonsters.includes(monster.name))
        .filter(monster => monster.size === monsterSize)
        .map((monster) => {
          return {
            name: monster.name,
            health: monster.baseHealth,
            size: monster.size,
            money: monster.baseMoney,
            points: monster.basePoints,
            rankXp: monster.baseRankXp,
            drops: monster.drops
          }
        })
      let selectedMonster = monsterList[this.getRandomInt(monsterList.length - 1)]
      this.setState({
        monsterName: selectedMonster.name,
        monsterSize: selectedMonster.size,
        monsterLevel: this.state.currentLocationLevel - selectedMonster.level,
        monsterTotalHealth: this.increaseMonsterHealth(selectedMonster.health, this.state.currentLocationLevel),
        monsterCurrentHealth: this.increaseMonsterHealth(selectedMonster.health, this.state.currentLocationLevel),
        monsterMoney: this.increaseMonsterDrops(selectedMonster.money, this.state.currentLocationLevel),
        monsterPoints: this.increaseMonsterDrops(selectedMonster.points, this.state.currentLocationLevel),
        monsterRankXp: this.increaseMonsterDrops(selectedMonster.rankXp, this.state.currentLocationLevel),
        monsterDrops: selectedMonster.drops
      })
    }

    refreshMonster() {
      //spawn regular small monsters during normal level
      //bosses are large monsters and have a time check
      //every time the player kills a large monster, the area level increases by 1

      if (this.state.currentLocationMonsters.length > 0) {
        if (this.state.currentLocationHunts > 0 && this.state.currentLocationHunts === this.state.currentLocationHuntsToNextLevel) {
          //Spawn large monster - increase area level by 1 when hunted
          this.spawnMonster("Large");
          this.countdownLargeMonsterBattle();
        } else {
          //Spawn small monster
          this.spawnMonster("Small");
        }
      }
    }

    increaseMonsterHealth(param, locationLevel) {
      //currentenemyhp += anynumber * sqrt(level)
      if (locationLevel > 1) {
        return Math.round(param += 100 * Math.sqrt(locationLevel));
      } else {
        return param;
      }
    }

    increaseMonsterDrops(param, locationLevel) {
      if (locationLevel > 1) {
        return Math.round(param += 10 * Math.sqrt(locationLevel));
      } else {
        return param;
      }
    }

    countdownLargeMonsterBattle() {
      this.resetClock();
      const largeMonsterHuntTime = setInterval(this.runCountdown, 1000);
      this.setState({
        clockId: largeMonsterHuntTime
      })
    }

    resetClock() {
      clearInterval(this.state.clockId);
      this.setState({
        battleTimer: 10
      })
    }

    runCountdown() {
      this.setState({
        battleTimer: this.state.battleTimer - 1
      })
    }
  
    getRandomInt(max) {
      return Math.floor(Math.random() * max);
    }
  
    handleDirectAttack() {
        this.setState({
          monsterCurrentHealth: this.state.monsterCurrentHealth - this.state.playerGuildDirectAttackPower
        })
    }
  
    checkBattleEnd() {
      let monsterDrops = this.state.monsterDrops
      const dropsToAdd = []

      monsterDrops.forEach((drop) => {
        const lotteryNumber = this.getRandomInt(100);
        if (lotteryNumber <= drop.chance) {
          dropsToAdd.push(drop.name)
        }
      })

      const finalDropsArray = [...this.state.playerGuildMonsterDrops, ...dropsToAdd]
  
      this.setState({
        playerGuildTotalHunts: this.state.playerGuildTotalHunts + 1,
        playerGuildMoney: this.state.playerGuildMoney + this.state.monsterMoney,
        playerGuildPoints: this.state.playerGuildPoints + this.state.monsterPoints,
        playerGuildXp: this.state.playerGuildXp + this.state.monsterRankXp,
        playerGuildMonsterDrops: finalDropsArray,
        currentLocationLevel: this.state.monsterSize === "Large" ? this.state.currentLocationLevel + 1 : this.state.currentLocationLevel,
        currentLocationHunts: this.state.currentLocationHunts + 1,
        currentLocationHuntsToNextLevel: this.state.monsterSize === "Large" ? Math.round(1.5 * this.state.currentLocationHuntsToNextLevel) : this.state.currentLocationHuntsToNextLevel,
        totalLocationHunts: this.state.totalLocationHunts + 1
      })
      if (this.state.playerGuildXp >= this.state.playerGuildXpToNextLevel) {
        this.setState({
          playerGuildRank: this.state.playerGuildRank + 1,
          playerGuildXpToNextLevel: Math.round(1.5 * this.state.playerGuildXpToNextLevel),
          playerGuildXp: 0
        })
      }
      this.refreshMonster();
    }
  
    hireHunter() {
      const newHunter = {
        name: 'Name',
        weapon: this.state.WEAPON_TYPES[this.getRandomInt(13)],
        rank: 1,
        attackPower: 10
      }
  
      if (this.state.playerGuildMoney - this.state.playerGuildMoneyToHireNextHunter >= 0) {
        const hunterArray = this.state.playerGuildHunters;
        hunterArray.push(newHunter)
  
        this.setState({
          playerGuildMoney: this.state.playerGuildMoney - this.state.playerGuildMoneyToHireNextHunter,
          playerGuildMoneyToHireNextHunter: Math.round(this.state.playerGuildMoneyToHireNextHunter * 1.5),
          playerGuildHunters: hunterArray,
          playerGuildCombinedHunterAttackPower: this.state.playerGuildCombinedHunterAttackPower + newHunter.attackPower
        })
      }
    }
  
    hunterAutoAttack = () => {
        this.setState({
          monsterCurrentHealth: this.state.monsterCurrentHealth - this.state.playerGuildCombinedHunterAttackPower
        }) 
    }
  
    render() {
      return (
        <div className="game">
          <div className="grid">
            <header className="page-header">
                <Header/>
            </header>
            <aside className="page-leftbar">
                <Player
                    playerGuildName={this.state.playerGuildName}
                    playerGuildRank={this.state.playerGuildRank}
                    playerGuildCombinedHunterAttackPower={this.state.playerGuildCombinedHunterAttackPower}
                    playerGuildDirectAttackPower={this.state.playerGuildDirectAttackPower}
                    playerGuildMoney={this.state.playerGuildMoney}
                    playerGuildPoints={this.state.playerGuildPoints}
                    playerGuildTotalHunts={this.state.playerGuildTotalHunts}
                    playerGuildXp={this.state.playerGuildXp}
                    playerGuildXpToNextLevel={this.state.playerGuildXpToNextLevel}
                />
            </aside>
            <aside className="page-nav">
                <HunterList
                    playerGuildRank={this.state.playerGuildRank}
                    playerGuildMoneyToHireNextHunter={this.state.playerGuildMoneyToHireNextHunter}
                    playerGuildHunters={this.state.playerGuildHunters}
                    hireHunter={this.hireHunter}
                />
            </aside>
            <main className="page-battle">
                <Battle
                    currentLocation={this.state.currentLocationName}
                    currentLocationLevel={this.state.currentLocationLevel}
                    currentLocationSubLevel={this.state.totalLocationHunts}
                    monsterName={this.state.monsterName}
                    monsterLevel={this.state.monsterLevel}
                    monsterTotalHealth={this.state.monsterTotalHealth}
                    monsterCurrentHealth={this.state.monsterCurrentHealth}
                    monsterSize={this.state.monsterSize}
                    battleTimer={this.state.battleTimer}
                    handleDirectAttack={this.handleDirectAttack}
                />
            </main>
            <div className="page-map">
                <Map
                  locations={this.state.mapLocations}
                  changeCurrentLocation={this.changeCurrentLocation}
                />
            </div>
            <footer className="page-footer">
                <Footer/>
            </footer>
          </div>
        </div>
      );
    }
}

export default GameController;