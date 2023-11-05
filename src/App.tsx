import React, {
    useEffect, useRef, useState,
} from 'react';
import {
    MapContainer, TileLayer, GeoJSON, Marker, Popup,
} from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';;
// import { airports } from './geomaps/Airports';
import 'leaflet/dist/leaflet.css';
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
            zoom={10}
            style={{
                width: '100vw',
                height: '100vh',
            }}
        >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        </MapContainer>
    );
}
export default App;
