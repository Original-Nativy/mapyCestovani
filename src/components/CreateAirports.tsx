// @ts-nocheck
import {
    Marker, Popup, LayersControl,
} from 'react-leaflet';
import {
    AirportsAll,
} from '../interfaces/Coordinates';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { greenIcon } from '../consts/consts';
import { Button, Row, Col, ButtonGroup, Spinner, Input } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
export const returnMarkers = (airpotAll: AirportsAll, country: string, allLayersUnchecked: boolean) => {

    const propagateClick = (e) => {


        console.log('Cluster clicked:', e);
    };

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
                onClick={(e) => propagateClick(e)}
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
                                <Input
                                className="spinner-location"
                                type="checkbox"
                                id={marker.properties.name_Air ?? marker.properties.city}
                                name={marker.properties.name_Air ?? marker.properties.city}
                                value={marker.properties.name_Air ?? marker.properties.city}
                                onClick={(e) => console.log(e)}
                            />
                            </Popup>

                        </Marker>
                    ))};
            </MarkerClusterGroup>
        </LayersControl.Overlay>);
};
