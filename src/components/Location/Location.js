import './Location.css'

export default function Location(props) {
    return (
        <div className='location-content'>
            <img src={'img/map-icons/' + props.name + '.png'} onClick={() => props.onClick(props.name)} alt='Location' />
            <p>{props.name}</p>
        </div>
    )
}