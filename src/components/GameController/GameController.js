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
        monsterLevel: 0,
        monsterTotalHealth: 0,
        monsterCurrentHealth: 0,
        monsterSize: '',
        monsterDrops: [],
        monsterMoney: 0,
        monsterPoints: 0,
        monsterRankXp: 0,
        //MAP
        mapLocations: locations,
        currentLocation: '',
        currentLocationLevel: 1,
        totalLocationHunts: 0,
        currentLocationHunts: 0,
        currentLocationHuntsToNextLevel: 10
      }

      this.changeCurrentLocation = this.changeCurrentLocation.bind(this);
      this.refreshMonster = this.refreshMonster.bind(this);
      this.handleDirectAttack = this.handleDirectAttack.bind(this);
      this.checkBattleEnd = this.checkBattleEnd.bind(this);
      this.hireHunter = this.hireHunter.bind(this);
      this.hunterAutoAttack = this.hunterAutoAttack.bind(this);
      this.increaseMonsterParams = this.increaseMonsterParams.bind(this);
    }
  
    componentDidMount() {
      setInterval(this.hunterAutoAttack, 1000);
      this.refreshMonster();
      this.setState({
        playerGuildTotalHunts: 0,
        currentLocation: "Forest"
      })
    }

    componentDidUpdate() {
      if (this.state.monsterCurrentHealth <= 0) {
        this.checkBattleEnd();
      }
    }

    changeCurrentLocation(location) {
      this.setState({
        currentLocation: location
      })
    }
  
    refreshMonster() {
      //spawn regular small monsters during normal level
      //bosses are large monsters and have a time check
      //every time the player kills a large monster, the area level increases by 1

      const smallMonsterList = monsters.filter(monster => monster.size === "Small").map((monster) => {
          return {
            name: monster.name,
            health: monster.baseHealth,
            money: monster.baseMoney,
            points: monster.basePoints,
            rankXp: monster.baseRankXp,
            drops: monster.drops
          }
      })

      const largeMonsterList = monsters.filter(monster => monster.size === "Large").map((monster) => {
          return {
            name: monster.name,
            health: monster.baseHealth,
            money: monster.baseMoney,
            points: monster.basePoints,
            rankXp: monster.baseRankXp,
            drops: monster.drops
          }
      })

      let selectedMonster;
      let monsterSize;

      if (this.state.currentLocationHunts > 0 && this.state.currentLocationHunts === this.state.currentLocationHuntsToNextLevel) {
        //Spawn large monster - increase area level by 1 when hunted
        monsterSize = "Large";
        selectedMonster = largeMonsterList[this.getRandomInt(largeMonsterList.length - 1)];
      } else {
        //Spawn small monster
        monsterSize = "Small";
        selectedMonster = smallMonsterList[this.getRandomInt(smallMonsterList.length - 1)]
      }

      this.setState({
          monsterName: selectedMonster.name,
          monsterSize: monsterSize,
          monsterLevel: this.state.currentLocationLevel - selectedMonster.level,
          monsterTotalHealth: this.increaseMonsterParams(selectedMonster.health, this.state.currentLocationLevel),
          monsterCurrentHealth: this.increaseMonsterParams(selectedMonster.health, this.state.currentLocationLevel),
          monsterMoney: this.increaseMonsterParams(selectedMonster.money, this.state.currentLocationLevel),
          monsterPoints: this.increaseMonsterParams(selectedMonster.points, this.state.currentLocationLevel),
          monsterRankXp: this.increaseMonsterParams(selectedMonster.rankXp, this.state.currentLocationLevel),
          monsterDrops: selectedMonster.drops
        })
    }

    increaseMonsterParams(param, locationLevel) {
      //currentenemyhp += anynumber * sqrt(level)
      if (locationLevel > 1) {
        return Math.round(param += 100 * Math.sqrt(locationLevel));
      } else {
        return param;
      }
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
        currentLocationHunts: this.state.monsterSize === "Large" ? 0 : this.state.currentLocationHunts + 1,
        currentLocationHuntsToNextLevel: this.state.monsterSize === "Large" ? Math.round(1.5 * this.state.currentLocationHuntsToNextLevel) : this.state.currentLocationHuntsToNextLevel,
        totalLocationHunts: this.state.totalLocationHunts + 1
      })
      console.log(this.state.currentLocationHuntsToNextLevel)
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
        const weaponTypes = [
            'Bow',
            'Charge Blade',
            'Dual Blades',
            'Great Sword',
            'Gunlance',
            'Hammer',
            'Heavy Bowgun',
            'Hunting Horn',
            'Insect Glaive',
            'Lance',
            'Light Bowgun',
            'Long Sword',
            'Switch Axe',
            'Sword and Shield'
        ]
  
      /*
        const hunterRanks = [
            'Low Rank',
            'High Rank',
            'G-Rank'
        ]
      */
  
      const newHunter = {
        name: 'Name',
        weapon: weaponTypes[this.getRandomInt(13)],
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
                    currentLocation={this.state.currentLocation}
                    currentLocationLevel={this.state.currentLocationLevel}
                    currentLocationSubLevel={this.state.totalLocationHunts}
                    monsterName={this.state.monsterName}
                    monsterLevel={this.state.monsterLevel}
                    monsterTotalHealth={this.state.monsterTotalHealth}
                    monsterCurrentHealth={this.state.monsterCurrentHealth}
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