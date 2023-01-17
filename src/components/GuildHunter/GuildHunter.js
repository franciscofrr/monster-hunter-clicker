import './GuildHunter.css'

export default function GuildHunter(props) {
    return (
      <div className='guild-hunter'>
          <img src={'img/weapons/' + props.weapon + '.png'} alt='Weapon'/>
          <div className='hunterName'>{props.name} - Rank: {props.rank} - Attack: {props.attackPower}</div>
      </div>
    )
  }