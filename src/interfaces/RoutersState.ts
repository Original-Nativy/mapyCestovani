import L from 'leaflet';
import { LatLngExpression } from 'leaflet';

interface Routers {
    point: {[key:string] : LatLngExpression}
}
export interface RoutersState {
id: number
points: Array<LatLngExpression>;
visible: boolean;
newRoutes: L.Routing.Control | null;
}
