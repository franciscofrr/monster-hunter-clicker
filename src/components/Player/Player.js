import './Player.css'

export default function Player(props) {
    return (
      <div className="player-content">
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