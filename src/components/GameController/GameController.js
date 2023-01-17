import React from 'react';

import Player from '../Player/Player'
import Battle from '../Battle/Battle'
import HunterList from '../HunterList/HunterList';
import Header from '../Header/Header'
import Footer from '../Footer/Footer'

import monsters from '../../data/monsters.json'
import './GameController.css'

class GameController extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        playerGuildName: 'Hunter Guild',
        playerGuildRank: 1,
        playerGuildXp: 0,
        playerGuildXpToNextLevel: 100,
        playerGuildTotalHunts: null,
        playerGuildMoney: 0,
        playerGuildPoints: 0,
        playerGuildHunters: [],
        playerGuildMonsterDrops: [],
        playerGuildDirectAttackPower: 100,
        playerGuildCombinedHunterAttackPower: 0,
        playerGuildMoneyToHireNextHunter: 50,
        monsterName: null,
        monsterLevel: null,
        monsterTotalHealth: null,
        monsterCurrentHealth: null,
        monsterDrops: [],
        monsterMoney: 0,
        monsterPoints: 0,
        monsterRankXp: 0
      }
    }
  
    componentDidMount() {
      setInterval(this.hunterAutoAttack, 1000);
      this.refreshMonster();
      this.setState({
        playerGuildTotalHunts: 0
      })
    }
  
    refreshMonster() {
      const monsterList = monsters.map((monster) => {
        return {
          name: monster.name,
          health: monster.baseHealth,
          money: monster.baseMoney,
          points: monster.basePoints,
          rankXp: monster.baseRankXp,
          drops: monster.drops
        }
      })
  
      const selectedMonster = monsterList[this.getRandomInt(111)]
  
      this.setState({
        monsterName: selectedMonster.name,
        monsterLevel: selectedMonster.level,
        monsterTotalHealth: selectedMonster.health,
        monsterCurrentHealth: selectedMonster.health,
        monsterMoney: selectedMonster.money,
        monsterPoints: selectedMonster.points,
        monsterRankXp: selectedMonster.rankXp,
        monsterDrops: selectedMonster.drops
      })
    }
  
    getRandomInt(max) {
      return Math.floor(Math.random() * max);
    }
  
    handleDirectAttack() {
        this.setState({
          monsterCurrentHealth: this.state.monsterCurrentHealth - this.state.playerGuildDirectAttackPower
        })
        if (this.state.monsterCurrentHealth <= 0) {
          this.checkBattleEnd();
        }
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
        playerGuildMonsterDrops: finalDropsArray
      })
      if (this.state.playerGuildXp >= this.state.playerGuildXpToNextLevel) {
        this.setState({
          playerGuildRank: this.state.playerGuildRank + 1,
          playerGuildXpToNextLevel: 1.5 * this.state.playerGuildXpToNextLevel,
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
        if (this.state.monsterCurrentHealth <= 0) {
          this.checkBattleEnd();
        }
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
                    hireHunter={() => this.hireHunter()}
                />
            </aside>
            <main className="page-main">
                <Battle
                    monsterName={this.state.monsterName}
                    monsterLevel={this.state.monsterLevel}
                    monsterTotalHealth={this.state.monsterTotalHealth}
                    monsterCurrentHealth={this.state.monsterCurrentHealth}
                    handleDirectAttack={() => this.handleDirectAttack()}
                />
            </main>
            <footer className="page-footer">
                <Footer/>
            </footer>
          </div>
        </div>
      );
    }
}

export default GameController;