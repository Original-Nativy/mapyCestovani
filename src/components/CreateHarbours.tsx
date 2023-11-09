// @ts-nocheck
import {
    Marker, Popup, LayersControl,
} from 'react-leaflet';
import {
    PortsAll,
} from '../interfaces/Coordinates';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { greenIcon } from '../consts/consts';

export const returnMarkersPorts = (portsAll: PortsAll, country: string, allLayersUnchecked: boolean) => {

    const lMarkers = portsAll ? portsAll.features.filter(objekt =>
        objekt.geometry.coordinates[0] > 92 && objekt.geometry.coordinates[1] > -12 && objekt.geometry.coordinates[1]< 26) : [];
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
                                <p>Název: {marker.properties.Name?? ''}</p>
                                <p>Země: {marker.properties.Name ?? ''}</p>
                            </Popup>
                        </Marker>
                    ))};
            </MarkerClusterGroup>
        </LayersControl.Overlay>);
};
