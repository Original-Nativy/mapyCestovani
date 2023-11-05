import React, {
    useEffect, useRef, useState,
} from 'react';
import {
    MapContainer, TileLayer, GeoJSON, Marker, Popup, LayerGroup, LayersControl, WMSTileLayer,
} from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';;
import 'leaflet/dist/leaflet.css';
import  Coordinates  from './interface/Coordinates';
import './App.css';
import L, {
    Layer, LeafletMouseEvent, Icon,
} from 'leaflet';


function App() {

    const generateRandomColor = () =>{
        const hue = Math.floor(Math.random() * 360);
        const saturation = 100;
        const lightness = 50;
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    };

    const [
        center,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        setCenter,
    ] = useState<Coordinates>(
        {
            y: 13.757353047871,
            x: 100.53427993073645,
            zoom: 12,
        });

    const [
        chosenRegion,
        setChosenRegion,
    ]=useState<string>('');

    const [
        allColors,
        setAllColors,
    ]=useState<string[]>([]);

    const geoServerIPPort = 'localhost:3000';
    const geoServerWorkspace = 'GIS';
    const stateLayerName = 'GIS:ins_st';

    const indStateLayer = L.tileLayer.wms (
        'http://' + geoServerIPPort + '/geoserver/' + geoServerWorkspace + '/wms',
        {
            layers: stateLayerName,
            format: 'image/png',
            transparent: true,
            version: '1.1.0',
        },
    );
    const overlayMaps = {
        'India States': indStateLayer,
    };

    const greenIcon = new Icon({
        iconUrl: '/location.png',
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
            -20,
        ],
    });

    return (
        <MapContainer
            center={[
                center.y,
                center.x,
            ]}
            zoom={13}
            maxZoom={13}
            style={{
                width: '100vw',
                height: '100vh',
            }}
        >

            <LayersControl position="topright">
                <LayersControl.BaseLayer
                    name ='Ahojda'
                >
                    <TileLayer
                        url='https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg'
            	        minZoom= {1}
                        maxZoom= {13}
                    />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer
                    name ='Mapa2'
                    checked

                >
                    <TileLayer
                        url='https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png'
            	        minZoom= {1}
                        maxZoom= {13}
                    />
                </LayersControl.BaseLayer>
                <LayersControl.Overlay name="Marker with popup">
                    <Marker
                        position={[
                            center.y,
                            center.x,
                        ]}
                        icon = {greenIcon}
                    >
                        <Popup>
                            A pretty CSS3 popup. <br /> Easily customizable.
                        </Popup>
                    </Marker>
                </LayersControl.Overlay>

                <LayersControl.Overlay
                    name="india"
                    checked
                >
                    <WMSTileLayer
                        layers={stateLayerName}
                        format='image/png'
                        transparent ={false}
                        version='1.1.0'
                        url={'http://' + geoServerIPPort + '/geoserver/' + geoServerWorkspace + '/wms'}
                    />
                </LayersControl.Overlay>
            </LayersControl>

        </MapContainer>
    );
}
export default App;

