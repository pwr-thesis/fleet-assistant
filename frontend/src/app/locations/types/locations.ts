import { Vehicle } from '../../vehicles/types/vehicles';

export interface Location {
    id: number;
    longitude: number;
    latitude: number;
}

export interface CustomMarker {
    position: google.maps.LatLngLiteral;
    vehicle: Vehicle;
    content: HTMLImageElement;
}
