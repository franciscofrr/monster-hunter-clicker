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
        <p>Attack Power: {props.playerGuildAttackPower}</p>
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
      playerGuildAttackPower: 50,
      playerGuildTotalHunts: null,
      playerGuildMoney: 0,
      playerGuildPoints: 0,
      playerGuildHunters: [],
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
    console.log(selectedMonster)

    this.setState({
      monsterName: selectedMonster.name,
      monsterLevel: selectedMonster.level,
      monsterTotalHealth: selectedMonster.health,
      monsterCurrentHealth: selectedMonster.health,
      monsterMoney: selectedMonster.money,
      monsterPoints: selectedMonster.points,
      monsterRankXp: selectedMonster.rankXp
    })
    console.log(this.state)
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  handleClick() {
      this.setState({
        monsterCurrentHealth: this.state.monsterCurrentHealth - this.state.playerGuildAttackPower
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

  render() {
    return (
      <div className="game">
        <div className="grid">
          <header className="page-header">
            <div className="content">
              <p>MONSTER HUNTER CLICKER</p>
            </div>
          </header>
          <aside className="page-leftbar">
            <div className="content">
              <PlayerGuild
              playerGuildName={this.state.playerGuildName}
              playerGuildRank={this.state.playerGuildRank}
              playerGuildAttackPower={this.state.playerGuildAttackPower}
              playerGuildMoney={this.state.playerGuildMoney}
              playerGuildPoints={this.state.playerGuildPoints}
              playerGuildTotalHunts={this.state.playerGuildTotalHunts}
              playerGuildXp={this.state.playerGuildXp}
              playerGuildXpToNextLevel={this.state.playerGuildXpToNextLevel}
              />
            </div>
          </aside>
          <main className="page-main">
            <div className="content">
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
            <div className="content">
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
