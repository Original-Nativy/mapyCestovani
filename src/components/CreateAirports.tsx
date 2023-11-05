import {
    Marker, Popup, LayersControl,
} from 'react-leaflet';
import {
    AirportsAll,
} from '../interfaces/Coordinates';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { Icon } from 'leaflet';


export const returnMarkers = (airpotAll: AirportsAll, country: string) => {
    const greenIcon = new Icon({
        iconUrl: '/plane.png',
        iconSize: [
            10,
            20,
        ],
        iconAnchor: [
            3,
            10,
        ],
        popupAnchor: [
            0,
            -5,
        ],
    });

    const lMarkers = airpotAll ? airpotAll.features.filter(objekt =>
        objekt.properties.country === country) : [];
    return(
        <LayersControl.Overlay
            name={country}
        >
            <MarkerClusterGroup
                chunkedLoading
            >{
                    lMarkers.map((marker, id) => (
                        <Marker
                            key={id}
                            position={[
                                marker.geometry.coordinates[1],
                                marker.geometry.coordinates[0],
                            ]}
                            icon={greenIcon}
                        >
                            <Popup>
                                <p>Název: {marker.properties.name_Air ?? marker.properties.city}</p>
                                <p>Země: {marker.properties.country}</p>
                            </Popup>
                        </Marker>
                    ))};
            </MarkerClusterGroup>
        </LayersControl.Overlay>);
};
