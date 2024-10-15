import { Component } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';

@Component({
    selector: 'app-all-locations',
    standalone: true,
    imports: [GoogleMap],
    templateUrl: './all-locations.component.html',
    styleUrl: './all-locations.component.scss',
})
export class AllLocationsComponent {
    zoom = 15;
    mapOptions: google.maps.MapOptions = {
        zoomControl: true,
        scrollwheel: true,
        disableDoubleClickZoom: true,
        maxZoom: 18,
        minZoom: 5,
        streetViewControl: false,
        mapTypeControl: false,
    };
}
