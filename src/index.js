import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';

import monsterpedia from './data/monsterpedia.json'

function PlayerGuild(props) {
  return (
    <div>
        <p>{props.playerGuildName}</p>
        <p>Rank {props.playerGuildRank}</p>
        <p>Guild XP: {props.playerGuildXp} / {props.playerGuildXpToNextLevel}</p>
        <p>Money: {props.playerGuildMoney}</p>
        <p>Guild Points: {props.playerGuildPoints}</p>
        <p>Direct Attack Power: {props.playerGuildDirectAttackPower}</p>
        <p>Hunter Attack Power: {props.playerGuildCombinedHunterAttackPower}</p>
        <p>Monsters Hunted: {props.playerGuildTotalHunts}</p>
    </div>
  )
}

function Monster(props) {
  return (
    <div>
        <p>{props.monsterName}</p>
        <img src={'img/monsters/' + props.monsterName + '.png'} onClick={props.onClick}/>
        <p>Health: {props.monsterCurrentHealth} / {props.monsterTotalHealth}</p>
    </div>
  )
}

function GuildHunter(props) {
  return (
    <div className='guild-hunter'>
        <img src={'img/weapons/' + props.weapon + '.png'}/>
        <div className='hunterName'>{props.name} - Rank: {props.rank} - Attack: {props.attackPower}</div>
    </div>
  )
}

class Battle extends React.Component {

  spawnMonster() {
    return(
      <Monster
        monsterName={this.props.monsterName}
        monsterLevel={this.props.monsterLevel}
        monsterTotalHealth={this.props.monsterTotalHealth}
        monsterCurrentHealth={this.props.monsterCurrentHealth}
        onClick={() => this.props.onClick()}
      />
    )
  }

  render() {
    return (
      <div>
        {this.spawnMonster()}
      </div>
    )
  }
}

class Game extends React.Component {

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
      playerGuildDirectAttackPower: 100,
      playerGuildCombinedHunterAttackPower: 0,
      playerGuildMoneyToHireNextHunter: 50,
      monsterName: null,
      monsterLevel: null,
      monsterTotalHealth: null,
      monsterCurrentHealth: null,
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
    const monsterList = monsterpedia.map((monster) => {
      return {
        name: monster.name,
        health: monster.baseHealth,
        money: monster.baseMoney,
        points: monster.basePoints,
        rankXp: monster.baseRankXp
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
      monsterRankXp: selectedMonster.rankXp
    })
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  handleClick() {
      this.setState({
        monsterCurrentHealth: this.state.monsterCurrentHealth - this.state.playerGuildDirectAttackPower
      })
      if (this.state.monsterCurrentHealth <= 0) {
        this.checkBattleEnd();
      }
  }

  checkBattleEnd() {
    this.setState({
      playerGuildTotalHunts: this.state.playerGuildTotalHunts + 1,
      playerGuildMoney: this.state.playerGuildMoney + this.state.monsterMoney,
      playerGuildPoints: this.state.playerGuildPoints + this.state.monsterPoints,
      playerGuildXp: this.state.playerGuildXp + this.state.monsterRankXp
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

    const hunterRanks = [
      'Low Rank',
      'High Rank',
      'G-Rank'
    ]

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
        playerGuildMoneyToHireNextHunter: this.state.playerGuildMoneyToHireNextHunter * 1.5,
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
    let button;
    let hunters;
    if (this.state.playerGuildRank >= 2) {
      button = <button onClick={() => this.hireHunter()}>Hire Hunter - ${this.state.playerGuildMoneyToHireNextHunter}</button>
      if (this.state.playerGuildHunters.length > 0) {
        hunters = this.state.playerGuildHunters.map(hunter => 
          <GuildHunter
            key={Math.random().toString(36).slice(2)}
            name={hunter.name}
            weapon={hunter.weapon}
            rank={hunter.rank}
            attackPower={hunter.attackPower}
          />
        )
      }
    }

    return (
      <div className="game">
        <div className="grid">
          <header className="page-header">
            <div className="header-content">
              <p>MONSTER HUNTER CLICKER</p>
            </div>
          </header>
          <aside className="page-leftbar">
            <div className="player-content">
              <PlayerGuild
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
            </div>
          </aside>
          <aside className="page-nav">
            <div className="guild-content">
              {button}
              {hunters}
            </div>
          </aside>
          <main className="page-main">
            <div className="battle-content">
              <Battle
                monsterName={this.state.monsterName}
                monsterLevel={this.state.monsterLevel}
                monsterTotalHealth={this.state.monsterTotalHealth}
                monsterCurrentHealth={this.state.monsterCurrentHealth}
                onClick={() => this.handleClick()}
              />
            </div>
          </main>
          <footer className="page-footer">
            <div className="footer-content">
              <p>Footer</p>
            </div>
          </footer>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
