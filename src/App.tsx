/* eslint-disable */

import React, {
    useEffect, useRef, useState, useCallback,
} from 'react';
import {
    MapContainer, TileLayer, GeoJSON, Marker, Popup, LayersControl, useMap,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { airportsAll } from './geomaps/AirportsAll';
import { allCountriesFeatures, maps, arrayOfCountries } from './consts/consts';
import Coordinates, {
    Feature, FeatureMalay, AirportsAll,
} from './interfaces/Coordinates';
import './App.css';
import L, {
    Control,
    ControlOptions,
    Layer, LeafletMouseEvent,
} from 'leaflet';
import { returnMarkers } from './components/CreateAirports';
import { Button, Row, Col, ButtonGroup } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as ModulA from 'leaflet.polylinemeasure';
import 'leaflet.polylinemeasure/Leaflet.PolylineMeasure.css';
import CustomInput from './components/CustomInput';

const CombinedModule = {...L, ...ModulA};

function App() {
    const generateRandomColor = () =>{
        const hue = Math.floor(Math.random() * 360);
        const saturation = 100;
        const lightness = 50;
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    };

    const airpotAll : AirportsAll = airportsAll;
    const poly = useRef<Control.PolylineMeasure | null>(null);

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
        allAirportsVisible,
        setAllAirportsVisible,
    ]=useState<boolean>(false);

    const [
        allStatesVisible,
        setAllStatesVisible,
    ]=useState<boolean>(false);

    const [
        allMaps,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        setAllMaps,
    ]= useState<{[key:string]: Feature | Feature[] | FeatureMalay[] | unknown}>(allCountriesFeatures);

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

    const [
        Map,
        setMap,
    ]=useState<L.Map | null>(null);

    const [
        measurDis,
        setMeasuringDistance,
    ]=useState<boolean>(false);

    const [
        clicked,
        setClicked,
    ] = useState<boolean>(false);

    const [
        value,
        setValue,
    ] = useState<string | null>(null);

    const [
        textFieldContent,
        setTextFieldContent,
    ] = useState<string>('');

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
                layer.bringToFront();
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
                layer.bringToBack();
            },
            click: onCountryClick,
        });
    };

    const onCountryClick = (event: LeafletMouseEvent) => {
        setChosenRegion(event.target.feature.properties.name);
        setTimeout(() => {
            event.target.setStyle({
                color: 'green',
                fillColor: 'green',
                fillOpacity: 0.5,
            });
        }, 1);
        setTextFieldContent(event.target.feature.properties.name);
    };

    const options: Control.PolylineMeasureOptions  = {
        position: 'topleft',
        unit: 'metres',
        clearMeasurementsOnStop: false,
    };

    function MyComponent() {
        const map = useMap()
        setMap(map);
        return null
    }

    useEffect(() => {
        if (Map === null) {
          return;
        }
        poly.current = CombinedModule.control.polylineMeasure(options).addTo(Map);
      },[Map]);

    useEffect(() => {
        window.addEventListener('click', () => {
            setMeasuringDistance(!!poly?.current?._measuring);
        })
    },[]);

    useEffect(() => {
        console.log(poly.current);
        if(!poly.current || !Map || !poly.current._layerPaint) {
            return;
        }
        if(measurDis) {
            poly.current._layerPaint.addTo(Map);
        }
        if(!measurDis) {
            Map.removeLayer(poly.current._layerPaint);
        }
    }, [measurDis]);

    function ShowAllStates() {
        return (
            <div className='edit-location-button mb-3'>
                <ButtonGroup>
                    <Button
                        color="primary"
                        onClick={() => {
                        setAllAirportsVisible(!allAirportsVisible);
                    }}
                    >
                        All airports
                    </Button>
                    <Button
                        color="success"
                        onClick={() => {
                            setAllStatesVisible(!allStatesVisible);
                        }}
                    >
                        All states
                    </Button>
                </ButtonGroup>
            </div>
        )
    }

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
        <MyComponent />
            <LayersControl.Overlay name='inputy'>
                <ShowAllStates />
                <Row className="edit-location-input">
                    <Col>
                        <CustomInput
                        readonly
                        type="text"
                        placeholder="Selected country"
                        value={textFieldContent}
                        name={'selectcountry'}
                        />
                    </Col>
                    <Col>
                        <CustomInput
                            onChange={e => { setValue(e); } }
                            type="text"
                            placeholder="Enter your text here"
                            value={value}
                            name={'searching'}
                        />
                    </Col>
                </Row>
            </LayersControl.Overlay>
            <LayersControl position="topright">
                {Object.entries(allMaps).map(([
                    key,
                    value,
                ], index) => (
                    <LayersControl.Overlay
                        key={index}
                        name={key}
                        checked={allStatesVisible}
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
                        url={maps.street}
            	        minZoom= {1}
                        maxZoom= {13}
                    />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer
                    name ='Empty'
                    checked
                >
                    <TileLayer
                        url={maps.empty}
            	        minZoom= {1}
                        maxZoom= {13}
                    />
                </LayersControl.BaseLayer>
            </LayersControl>
            <LayersControl
                position="topleft"
            >
                {arrayOfCountries.map(country => (
                    returnMarkers(airpotAll, country, allAirportsVisible)))}
            </LayersControl>
        </MapContainer>
    );
};

export default App;

