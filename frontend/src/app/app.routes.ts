import { Routes } from '@angular/router';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { WelcomeManagementComponent } from './welcome-page/welcome-management/welcome-management.component';
import { WelcomeMaintenanceComponent } from './welcome-page/welcome-maintenance/welcome-maintenance.component';
import { WelcomeTrackingComponent } from './welcome-page/welcome-tracking/welcome-tracking.component';
import { RegisterComponent } from './auth/components/register/register.component';
import { LoginComponent } from './auth/components/login/login.component';
import { PasswordResetComponent } from './auth/components/password-reset/password-reset.component';
import { loggedUserRestrictGuard } from '../utilities/guards/logged-user-restrict.guard';
import { VehiclesAllComponent } from './vehicles/components/vehicles-all/vehicles-all.component';
import { authGuard } from '../utilities/guards/auth.guard';
import { VehicleCreateComponent } from './vehicles/components/vehicle-create/vehicle-create.component';
import { AllLocationsComponent } from './locations/components/all-locations/all-locations.component';

export const routes: Routes = [
    { path: 'management-info', component: WelcomeManagementComponent },
    { path: 'maintenance-info', component: WelcomeMaintenanceComponent },
    { path: 'tracking-info', component: WelcomeTrackingComponent },
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [loggedUserRestrictGuard],
    },
    {
        path: 'register',
        component: RegisterComponent,
        canActivate: [loggedUserRestrictGuard],
    },
    {
        path: 'password-reset',
        component: PasswordResetComponent,
        canActivate: [loggedUserRestrictGuard],
    },
    {
        path: 'vehicles',
        component: VehiclesAllComponent,
        canActivate: [authGuard],
    },
    {
        path: 'new-vehicle',
        component: VehicleCreateComponent,
        canActivate: [authGuard],
    },
    {
        path: 'locations',
        component: AllLocationsComponent,
        canActivate: [authGuard],
    },
    { path: '', component: WelcomePageComponent },
    { path: '**', redirectTo: '' },
];
