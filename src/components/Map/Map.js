import React from 'react';
import './Map.css'
import Location from '../Location/Location'

class Map extends React.Component {
    getLocationList() {
        let locationList = this.props.locations.map((location) => {
            return <Location
                key={Math.random().toString(36).slice(2)}
                name={location.name}
                onClick={this.props.changeCurrentLocation}
            />
        })
        return locationList;
    }

    render() {
        return (
            <div className='map-content'>
                {this.getLocationList()}
            </div>
        )
    }
}

export default Map;