/* eslint-disable */
// @ts-nocheck
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
import { RoutersState } from './interfaces/RoutersState';
import './App.css';
import L, {
    Control,
    ControlOptions,
    LatLng,
    Layer, LeafletMouseEvent, bind, latLng,
} from 'leaflet';
import { returnMarkers } from './components/CreateAirports';
import { Button, Row, Col, ButtonGroup, Spinner } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import * as ModulA from 'leaflet.polylinemeasure';
import 'leaflet.polylinemeasure/Leaflet.PolylineMeasure.css';
import CustomInput from './components/CustomInput';
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.js";
import { LatLngExpression } from 'leaflet';
import { greenIcon } from './consts/consts';

//  require('leaflet-routing-machine');
const CombinedModule = {...L, ...ModulA};

function App() {
    const generateRandomColor = () =>{
        const hue = Math.floor(Math.random() * 360);
        const saturation = 100;
        const lightness = 50;
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    };

    const options: Control.PolylineMeasureOptions  = {
        position: 'topleft',
        unit: 'metres',
        clearMeasurementsOnStop: false,
    };
    const airpotAll : AirportsAll = airportsAll;
    const poly = useRef<Control.PolylineMeasure | null>(null);
    const zooming = useRef<boolean>(false);
    const currentRouteRef = useRef<number | null>(null);

    const [
        center,
        setCenter,
    ] = useState<Coordinates>(
        {
            y: 13.757353047871,
            x: 100.53427993073645,
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
        textFieldContentRef.current = chosenRegion;
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
    ] = useState<boolean>(true);

    const alloweToClick = useRef<boolean>(true);

    const [
        value,
        setValue,
    ] = useState<string | null>(null);

    const [
        textFieldContent,
        setTextFieldContent,
    ] = useState<string>('');
    const textFieldContentRef = useRef<string>(textFieldContent);

    useEffect(() => {
        textFieldContentRef.current = textFieldContent;
    }, [textFieldContent]);

    const [
        buttonColor,
        setButtonColor,
    ] = useState<boolean>(false);

    const routesVisible = useRef<boolean>(false);

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
        console.log('show click on country', event.target.feature.properties.name)
        textFieldContentRef.current = event.target.feature.properties.name;

        setChosenRegion(Math.floor(Math.random() * 360).toString());
        setTimeout(() => {
            event.target.setStyle({
                color: 'green',
                fillColor: 'green',
                fillOpacity: 0.5,
            });
        }, 1);
        setTextFieldContent(event.target.feature.properties.name);
    };

    const MyComponent= () => {
        const map = useMap()
        setMap(map);
        return null
    }
    const [
        loading,
        setLoading,
    ] = useState<boolean>(false);

    const createRoute = (latlng: LatLngExpression[]) => {
        const control = L.Routing.control({
            waypoints: [
                latlng[0],
                latlng[1],
            ],
            showAlternatives: true,
            suppressDemoServerWarning: true,
            show: false,
            geocoder: L.Control.Geocoder.nominatim(),
            altLineOptions: {
                extendToWaypoints: true,
                missingRouteTolerance: 100000,
                styles: [
                    {color: 'black', opacity: 0.15, weight: 9},
                    {color: 'white', opacity: 0.8, weight: 6},
                    {color: 'blue', opacity: 0.5, weight: 2},
                ],
            },
            createMarker: function (i: number, waypoint: any, n: number) {
                const marker = L.marker(waypoint.latLng, {
                draggable: true,
                bounceOnAdd: false,
                bounceOnAddOptions: {
                    duration: 1000,
                    height: 800,
                    function() {
                    (bindPopup(myPopup).openOn(Map))
                    }
                },
                icon: L.icon({
                    iconUrl: '/car.png',
                    iconSize: [30,30],
                    iconAnchor: [12,28],
                    popupAnchor: [0,-5],
                })
                });
                return marker;
            },
        });
    return control;
    }

    const routeMarker = useRef<L.Marker | null>(null);
    const routing = useRef<boolean>(false);

    const [
        routesDict,
        setRoutesDict,
    ] = useState<RoutersState[]>([]);
    const routesDictRef = useRef<RoutersState[]>(routesDict);

    const something = (latlng: LatLngExpression) => {
        if(currentRouteRef.current === null) {
            return;
        }
        const index = currentRouteRef.current - 1;
        const objectOfRef = routesDictRef.current[index];
        console.log(objectOfRef, 'routesDict on click')

        if(objectOfRef.points.length > 1) {
            if(objectOfRef.newRoutes._map) {
                return;
            }
            objectOfRef.newRoutes.addTo(Map);
            setRoutesDict(prevState => {
                const updatedRoutes = [...prevState];
                updatedRoutes[index].newRoutes = objectOfRef.newRoutes;
                return updatedRoutes;
            })
            return;
        }
        if(latlng.lat === 0 && latlng.lng === 0) {
            return;
        }
        console.log('whattt zemeeee',textFieldContentRef.current)

        if(textFieldContentRef.current === ''){
            console.log('neni vybrana zeme')
            return;
        }
        console.log('zemeeee',textFieldContentRef.current)
        objectOfRef.points.push(latlng);
        if(objectOfRef.points.length > 1) {
            const newRoute = L.marker(latlng,{
                options: {
                    route: createRoute(objectOfRef.points), // Function that return route object(L.Routing.control)
                    },
                }).on('rountingstart', () => {
                    routing.current = true;})
                    .on('routesfound', () => {
                        routing.current = false;
                    });

            setRoutesDict(prevState => {
                const updatedRoutes = [...prevState];
                updatedRoutes[index].newRoutes = newRoute.options.options.route;
                return updatedRoutes;
            });
            if(Map !== null && routesVisible.current){
                console.log('to map')
                newRoute.options.options.route.addTo(Map);
            }
            console.log('nova routa',newRoute.options.options.route)
            return;
        }
        setRoutesDict(prevState => {
            const updatedRoutes = [...prevState];
            updatedRoutes[index] = objectOfRef;
            return updatedRoutes;
        });
        return;
    }

    const removeRoute = (id: number) => {
        if(currentRouteRef.current === null || !currentRouteRef.current) {
            return;
        }
        console.log('currentRouteRef.current',currentRouteRef.current, 'routesDict',routesDictRef.current)
        const toRemove = routesDictRef.current.filter(item => item.id === id)
        if(!toRemove[0]) {
            return;
        }
        console.log('toRemove',toRemove[0])
        console.log('what',routesDictRef.current[id-1].newRoutes)
        toRemove.map(item => {
            setLoading(true);
            setTimeout(() => {
            if(item.newRoutes && routesDictRef.current[id-1].newRoutes?._map !== null && !routing.current) {
                try {
                    item.newRoutes.remove();
                }
                catch(err) {
                    console.log(err)
                }
            }
            setRoutesDict(prevState => {
                const updatedRoutes = [...prevState];
                updatedRoutes[item.id-1].newRoutes = item.newRoutes;
                return updatedRoutes;
            })
            setLoading(false);
        },1000)
        })
    }

    const removeAllRoutes = () => {
        if(currentRouteRef.current === null) {
            return;
        }
        routesDictRef.current.map(item => {
            if(item.newRoutes) {
                item.newRoutes.remove();
            }
        })
    }
    useEffect(() => {
        if (Map === null) {
          return;
        }
        poly.current = CombinedModule.control.polylineMeasure(options).addTo(Map);
        Map.doubleClickZoom.disable();
        Map.addEventListener('click', (e) => {
            textFieldContentRef.current = '';
            setTimeout(() => {
            if(alloweToClick.current) {
                console.log('souradnice on dblclick',e.latlng)
                something(e.latlng)
            }},10)
        })
        // console.log(control)
        // createRoute().addTo(Map);

    },[Map]);


    useEffect(() => {
        window.addEventListener('click', () => {
            setMeasuringDistance(!!poly?.current?._measuring);
        })
    },[]);

    useEffect(() => {
        console.log(poly.current, 'poly');
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

    useEffect(() => {
        console.log('routesDict',routesDict)
        routesDictRef.current = routesDict;
    }, [routesDict]);

    function ShowAllStates() {
        return (
            <div className='edit-location-button mb-3'>
                <ButtonGroup
                    onMouseEnter={() => {
                        alloweToClick.current = false;
                    }}
                    onMouseLeave={() => {
                        alloweToClick.current = true;
                    }}
                >
                    <Button
                        color="primary"
                        onClick={() => {
                        setAllAirportsVisible(!allAirportsVisible);
                    }}
                    >
                        All airports
                    </Button>
                    <Button
                        color="secondary"
                        onClick={() => {
                            setAllStatesVisible(!allStatesVisible)
                        }}
                        >
                        All states
                    </Button>
                    <Button
                        color= {buttonColor ? "danger" : "success"}
                        onClick ={() => {
                            setButtonColor(!routesVisible.current);
                            routesVisible.current = !routesVisible.current;
                            buttonColor ? removeAllRoutes() : null;
                        }}
                    >
                        {buttonColor ? "Hide route" : "Show route"}
                    </Button>
                </ButtonGroup>
            </div>
        )
    }

    const [
        currentRoute,
        setCurrentRoute,
    ] = useState<number | null>(null);

    const [
        openDialog,
        setOpenDialog,
    ] = useState<boolean>(false);

    function ShowDialog() {
        return(
        <Marker
        key={1}
        position={[
            center.y,
            center.x,
        ]}
        icon={greenIcon}
        >
            <Popup>
                <p>doubleclick to</p>
                <p>choose points</p>
            </Popup>
        </Marker>
        )
    }


    function ShowAllRoutes() {
        return (
            <div className='edit-location-button-second mb-3 h-1'>
                <ButtonGroup
                    onMouseEnter={() => {
                        alloweToClick.current = false;
                    }}
                    onMouseLeave={() => {
                        alloweToClick.current = true;
                    }}
                >
                    <Button
                        className='me-1'
                        color="info"
                        onClick={() => {
                            if(routesDict.length >9) {
                                return;
                            }
                            setRoutesDict((prevState) => [
                                ...prevState,
                                {
                                    id: routesDict.length + 1,
                                    points: [],
                                    visible: true,
                                    newRoutes: null,
                                },
                            ]);
                        }}
                    >
                        +
                    </Button>
                        {routesDict.map((route) => (
                        <ButtonGroup
                            key={route.id+200}
                            className="btn-group-horizontal">
                            <Button
                            key={route.id+100}
                            onClick={() => {
                                removeRoute(route.id);
                                currentRouteRef.current = null;
                                setCurrentRoute(null);
                            }}
                            color='danger'
                            >
                                X
                            </Button>
                            <Button
                                className='me-1'
                                key={route.id}
                                color={routesDict[route.id-1]?.newRoutes?._map ? "success" : "secondary"}
                                onClick={() => {
                                    setOpenDialog(true);
                                    currentRouteRef.current = route.id;
                                    setCurrentRoute(route.id)
                                    something(latLng(0,0));
                                }}
                            >
                                {route.id}
                            </Button>
                            </ButtonGroup>
                        ))}
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
                {loading && <Spinner className='spinner-location' color="primary" />}
                <ShowAllStates />
                {buttonColor &&
                <ShowAllRoutes />}
                {openDialog &&
                <ShowDialog />}
                <Row className="input-location">
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

