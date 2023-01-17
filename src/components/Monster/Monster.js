export default function Monster(props) {
    return (
      <div>
          <p>{props.monsterName}</p>
          <img src={'img/monsters/' + props.monsterName + '.png'} onClick={props.onClick} alt='Monster'/>
          <p>Health: {props.monsterCurrentHealth} / {props.monsterTotalHealth}</p>
      </div>
    )
  }