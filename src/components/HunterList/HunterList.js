import GuildHunter from '../GuildHunter/GuildHunter';
import './HunterList.css'

export default function HunterList(props) {
    let buttonToHireHunters;
    let huntersToShowOnList = [];

    if (props.playerGuildRank >= 2) {
        buttonToHireHunters = <button onClick={() => props.hireHunter()}>Hire Hunter - ${props.playerGuildMoneyToHireNextHunter}</button>
        if (props.playerGuildHunters.length > 0) {
            huntersToShowOnList = props.playerGuildHunters.map((hunter) => {
                return <GuildHunter
                    key={Math.random().toString(36).slice(2)}
                    name={hunter.name}
                    weapon={hunter.weapon}
                    rank={hunter.rank}
                    attackPower={hunter.attackPower}
                />
            })
            console.log(huntersToShowOnList)
        }
    }

    return (
        <div className="hunter-list-content">
            {buttonToHireHunters}
            {huntersToShowOnList}
        </div>
    )
}