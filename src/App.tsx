import React, {
    useEffect, useRef, useState,
} from 'react';
import {
    MapContainer, TileLayer, GeoJSON, Marker, Popup, LayersControl,
} from 'react-leaflet';
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
import 'leaflet/dist/leaflet.css';
import Coordinates, {
    Feature, FeatureMalay, AirportsAll,
} from './interfaces/Coordinates';
import './App.css';
import {
    Layer, LeafletMouseEvent,
} from 'leaflet';
import { returnMarkers } from './components/CreateAirports';


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

    const arrayOfCountries = [
        'Thailand',
        'Philippines',
        'Maldives',
        'Malaysia',
        'Taiwan',
        'Indonesia',
        'Vietnam',
        'United Arab Emirates',
        'Israel',
        'Hong Kong',
    ];

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
            <LayersControl position="topright">
                {Object.entries(allMaps).map(([
                    key,
                    value,
                ], index) => (
                    <LayersControl.Overlay
                        key={index}
                        name={key}
                    >
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
                    </LayersControl.Overlay>
                ))}
                <LayersControl.BaseLayer
                    name ='Streets'
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            	        minZoom= {1}
                        maxZoom= {13}
                    />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer
                    name ='Empty'
                    checked
                >
                    <TileLayer
                        url='https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png'
            	        minZoom= {1}
                        maxZoom= {13}
                    />
                </LayersControl.BaseLayer>
                <LayersControl.Overlay
                    name='Airports'
                >
                    {arrayOfCountries.map(country => (
                        returnMarkers(airpotAll, country)))}

                </LayersControl.Overlay>
            </LayersControl>
        </MapContainer>
    );
}
export default App;
