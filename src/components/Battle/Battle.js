import React from 'react';
import Monster from "../Monster/Monster"
import './Battle.css'

class Battle extends React.Component {

    spawnMonster() {
      return(
        <Monster
          monsterName={this.props.monsterName}
          monsterLevel={this.props.monsterLevel}
          monsterTotalHealth={this.props.monsterTotalHealth}
          monsterCurrentHealth={this.props.monsterCurrentHealth}
          onClick={this.props.handleDirectAttack}
        />
      )
    }
  
    render() {
      return (
        <div className="battle-content">
          Location: {this.props.currentLocation}
          {this.spawnMonster()}
        </div>
      )
    }
}

export default Battle;