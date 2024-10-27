import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Vehicle } from '../../types/vehicles';
import { toDisplayDate } from '../../../../utilities/date-utils';
@Component({
    selector: 'app-vehicle-details',
    standalone: true,
    imports: [],
    templateUrl: './vehicle-details.component.html',
})
export class VehicleDetailsComponent implements OnInit {
    vehicle!: Vehicle;

    constructor(private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.vehicle = this.route.snapshot.data['vehicle'];
    }

    protected readonly toDisplayDate = toDisplayDate;
}
