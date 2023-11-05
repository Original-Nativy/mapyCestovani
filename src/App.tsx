import React, {
    useEffect, useRef, useState,
} from 'react';
import {
    MapContainer, TileLayer, GeoJSON, Marker, Popup,
} from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { malaysia } from './geomaps/Malaysia';
import { indonesia } from './geomaps/Indonesia';
import { thailand } from './geomaps/Thailand';
import { philippines } from './geomaps/Philippines';
import { vietnam } from './geomaps/Vietnam';
import { taiwan } from './geomaps/Taiwan';
import { hongkong } from './geomaps/Hongkong';
import { maldives } from './geomaps/Maldives';
import { airportsAll } from './geomaps/AirportsAll';
import { uae } from './geomaps/Uae';
import { israel } from './geomaps/israel';
// import { airports } from './geomaps/Airports';
import 'leaflet/dist/leaflet.css';
import Coordinates, {
    Feature, FeatureMalay, AirportsAll,
} from './interfaces/Coordinates';
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

    const airpotAll : AirportsAll = airportsAll;

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
        allMaps,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        setAllMaps,
    ]=useState<{[key:string]: Feature | Feature[] | FeatureMalay[] | unknown}>({
        'dataIndonesia': indonesia.features,
        'dataMalaysia': malaysia.features,
        'dataThailand': thailand.features,
        'dataPhilippines': philippines.features,
        'dataVietnam': vietnam.features,
        'dataTaiwan': taiwan.features,
        'dataHongkong': hongkong.features,
        'dataMaldives': maldives.features,
        'dataUae': uae.features,
        'dataIsrael': israel.features,
    });

    const [
        allColors,
        setAllColors,
    ]=useState<string[]>([]);

    useEffect(() => {
        console.log(chosenRegion);
    }, [ chosenRegion ]);

    useEffect(() => {
        const colors: string[] = [];
        Object.keys(allMaps).forEach(() => colors.push(generateRandomColor()));
        setAllColors(colors);
    }, []);

    const onCountryClick = (event: LeafletMouseEvent) => {
        setChosenRegion(event.target.feature.properties.name);
        setTimeout(() => {
            event.target.setStyle({
                color: 'green',
                fillColor: 'green',
                fillOpacity: 0.5,
            });
        }, 1);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onEachCountry = (feature: GeoJSON.Feature<GeoJSON.Geometry, any> , layer: Layer) => {
        feature.properties.name;
        layer.on({
            mouseover: e => {
                if(e.target.options.color === 'green') {
                    return;
                }
                const layer = e.target;
                layer.setStyle({
                    fillColor: 'red',
                    fillOpacity: 0.5,
                });
            },
            mouseout: e => {
                const layer = e.target;
                if(layer.options.color === 'green') {
                    return;
                }
                layer.setStyle({
                    color: layer.options.color,
                    fillColor: layer.options.color,
                    fillOpacity: 0.4,
                });
            },
            click: onCountryClick,
        });
    };

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

    const returnMarkers = () =>{
        const lMarkers = airpotAll ? airpotAll.features.filter(objekt =>
            objekt.properties.country === 'Thailand' ||
            objekt.properties.country === 'Philippines' ||
            objekt.properties.country === 'Maldives' ||
            objekt.properties.country === 'Taiwan' ||
            objekt.properties.country === 'Indonesia' ||
            objekt.properties.country === 'Vietnam' ||
            objekt.properties.country === 'United Arab Emirates' ||
            objekt.properties.country === 'Israel' ||
            objekt.properties.country === 'Hong Kong'): [];
        return (lMarkers.map((marker, id) => (
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
                {/* {marker.properties.name &&
                    <Tooltip
                        direction="bottom"
                        offset={[
                            0,
                            0,
                        ]}
                        opacity={1}
                        permanent
                    >{marker.properties.name_en ?? marker.properties.name}</Tooltip>
                } */}
            </Marker>
        )));
    };

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
            {Object.entries(allMaps).map(([
                key,
                value,
            ], index) => (
                <GeoJSON
                    key={key}
                    data={{
                        type: 'FeatureCollection',
                        features: value,
                    }as GeoJSON.GeoJsonObject}

                    onEachFeature={onEachCountry}
                    style={{
                        color: `${allColors[index]}`,
                        fillColor: `${allColors[index]}`,
                        fillOpacity: 0.4,
                    }}
                />
            ))}
            <MarkerClusterGroup
                chunkedLoading
            >
                {returnMarkers()}
            </MarkerClusterGroup>
            {/* <GeoJSON
                key={'airports'}
                data={{
                    type: 'FeatureCollection',
                    features: airportFeature,
                }as GeoJSON.GeoJsonObject}

                style={{
                    color: 'black',
                    fillColor: 'black',
                    fillOpacity: 0.4,
                }}
            /> */}

        </MapContainer>
    );
}
export default App;
