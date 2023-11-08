import {
    Marker, Popup, LayersControl,
} from 'react-leaflet';
import {
    AirportsAll,
} from '../interfaces/Coordinates';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { greenIcon } from '../consts/consts';

export const returnMarkers = (airpotAll: AirportsAll, country: string, allLayersUnchecked: boolean) => {

    const lMarkers = airpotAll ? airpotAll.features.filter(objekt =>
        objekt.properties.country === country) : [];
    return(
        <LayersControl.Overlay
            key={country}
            name={country}
            checked={allLayersUnchecked}
        >
            <MarkerClusterGroup
                key={country}
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
