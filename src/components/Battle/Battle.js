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
      let countdown;
      if (this.props.monsterSize === 'Large') {
        countdown = `${this.props.battleTimer} seconds left`;
      }

      if (this.props.currentLocation) {
        return (
          <div className="battle-content">
            Location: {this.props.currentLocation} (Level {this.props.currentLocationLevel}) - {this.props.currentLocationSubLevel} Monsters Hunted
            <p>{countdown}</p>
            {this.spawnMonster()}
          </div>
        )
      } else {
        return (
          <div className="battle-content">
            <p>SELECT A LOCATION TO BEGIN HUNTING</p>
          </div>
        )
      }
    }
}

export default Battle;