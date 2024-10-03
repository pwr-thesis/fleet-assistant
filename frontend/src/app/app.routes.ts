import { Routes } from '@angular/router';
import { WelcomePageComponent } from './welcome/welcome-page/welcome-page.component';
import { WelcomeManagementComponent } from './welcome/welcome-management/welcome-management.component';
import { WelcomeMaintenanceComponent } from './welcome/welcome-maintenance/welcome-maintenance.component';
import { WelcomeTrackingComponent } from './welcome/welcome-tracking/welcome-tracking.component';
import { RegisterComponent } from './welcome/register/register.component';
import { LoginComponent } from './welcome/login/login.component';
import { PasswordResetComponent } from './welcome/password-reset/password-reset.component';

export const routes: Routes = [
    { path: 'management-info', component: WelcomeManagementComponent },
    { path: 'maintenance-info', component: WelcomeMaintenanceComponent },
    { path: 'tracking-info', component: WelcomeTrackingComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'password-reset', component: PasswordResetComponent },
    { path: '', component: WelcomePageComponent },
    { path: '**', redirectTo: '' },
];
