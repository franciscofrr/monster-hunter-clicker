import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Hunter(props) {
  return (
    <div>
        <p>{props.hunterName}</p>
        <p>Rank: {props.hunterRank}</p>
        <p>Attack: {props.hunterAttack}</p>
        <p>Monsters Hunted: {props.hunterTotalHunts}</p>
    </div>
  )
}

function Monster(props) {
  return (
    <div>
        <p>{props.monsterName}</p>
        <img src={props.monsterName + '.png'} onClick={props.onClick}/>
        <p>Level: {props.monsterLevel}</p>
        <p>Health: {props.monsterHealth}</p>
    </div>
  )
}

class Battle extends React.Component {

  spawnMonster() {
    return(
      <Monster
        monsterName={this.props.monsterName}
        monsterLevel={this.props.monsterLevel}
        monsterHealth={this.props.monsterHealth}
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
      hunterName: 'Hero',
      hunterRank: 1,
      hunterAttack: 10,
      hunterTotalHunts: null,
      currentMonsterName: null,
      currentMonsterLevel: null,
      currentMonsterHealth: null
    }
  }

  componentDidMount() {
    this.refreshMonster();
    this.setState({
      hunterTotalHunts: 0
    })
  }

  handleClick() {
    const hunterAttack = this.state.hunterAttack;
      this.setState({
        currentMonsterHealth: this.state.currentMonsterHealth - hunterAttack
      })
  }

  refreshMonster() {
    const monsterList = [
      {
        name: 'Anjanath',
        level: 1,
        health: 150
      },
      {
        name: 'Arzuros',
        level: 1,
        health: 100
      },
      {
        name: 'Barioth',
        level: 1,
        health: 135
      },
      {
        name: 'Barroth',
        level: 1,
        health: 155
      },
      {
        name: 'Deviljho',
        level: 1,
        health: 170
      },
      {
        name: 'Khezu',
        level: 1,
        health: 145
      },
      {
        name: 'Rathalos',
        level: 1,
        health: 150
      }
    ]

    const selectedMonster = monsterList[this.getRandomInt(7)]
    this.setState({
      currentMonsterName: selectedMonster.name,
      currentMonsterLevel: selectedMonster.level,
      currentMonsterHealth: selectedMonster.health
    })
  }

  getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  checkHuntEnd() {
    if (this.state.currentMonsterHealth <= 0) {
      this.setState({
        hunterTotalHunts: this.state.hunterTotalHunts + 1
      })
      this.refreshMonster();
    }
  }

  render() {
    this.checkHuntEnd();
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
              <Hunter
              hunterName={this.state.hunterName}
              hunterRank={this.state.hunterRank}
              hunterAttack={this.state.hunterAttack}
              hunterTotalHunts={this.state.hunterTotalHunts}
              />
            </div>
          </aside>
          <main className="page-main">
            <div className="content">
              <Battle
                monsterName={this.state.currentMonsterName}
                monsterLevel={this.state.currentMonsterLevel}
                monsterHealth={this.state.currentMonsterHealth}
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
