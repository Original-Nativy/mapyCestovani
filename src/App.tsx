import React, {
    useEffect, useRef, useState,
} from 'react';
import {
    MapContainer, TileLayer, GeoJSON, Marker, Popup, LayerGroup, LayersControl,
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

    const greenIcon = new Icon({
        iconUrl: 'marker/plane.png',
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

    return (
        <MapContainer
            center={[
                center.y,
                center.x,
            ]}
            zoom={13}
            style={{
                width: '100vw',
                height: '100vh',
            }}
        >

            <LayersControl position="topright">
                <LayersControl.Overlay
                    name ='Ahojda'
                    checked={true}
                >
                    <TileLayer
                        url='https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg'
            	        minZoom= {1}
                        maxZoom= {16}
                    />
                </LayersControl.Overlay>
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
            </LayersControl>

        </MapContainer>
    );
}
export default App;

