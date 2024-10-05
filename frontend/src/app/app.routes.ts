import { Routes } from '@angular/router';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { WelcomeManagementComponent } from './welcome-page/welcome-management/welcome-management.component';
import { WelcomeMaintenanceComponent } from './welcome-page/welcome-maintenance/welcome-maintenance.component';
import { WelcomeTrackingComponent } from './welcome-page/welcome-tracking/welcome-tracking.component';
import { RegisterComponent } from './auth/register/register.component';
import { LoginComponent } from './auth/login/login.component';
import { PasswordResetComponent } from './auth/password-reset/password-reset.component';

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
