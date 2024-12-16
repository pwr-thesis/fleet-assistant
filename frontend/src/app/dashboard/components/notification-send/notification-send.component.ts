import { 
  Component, 
  DestroyRef, 
  ElementRef, 
  OnInit, 
  ViewChild 
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { DriversService } from '../../../drivers/service/drivers.service';
import { Driver } from '../../../drivers/types/drivers';
import { AuthService } from '../../../auth/service/auth.service';
import { NotificationService } from '../../service/notifications.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatInput } from '@angular/material/input';
import { 
  FormsModule, 
  FormBuilder, 
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { 
  MatAutocomplete, 
  MatAutocompleteTrigger, 
  MatOption 
} from '@angular/material/autocomplete';
import { 
  MatFormField, 
  MatLabel,
  MatError
} from '@angular/material/form-field';
import { SnackbarService } from '../../../../utilities/services/snackbar.service';


@Component({
  selector: 'app-notification-send',
  standalone: true,
  imports: [
    CommonModule,
    MatIcon,
    FormsModule,
    ReactiveFormsModule,
    MatAutocomplete,
    MatAutocompleteTrigger,
    MatOption,
    MatFormField,
    MatLabel,
    MatInput,
    MatError
  ],
  templateUrl: './notification-send.component.html',
  styleUrl: './notification-send.component.scss'
})
export class NotificationSendComponent implements OnInit{

  notificationForm: FormGroup;
  drivers: (Driver | string)[] = [];
  filteredDrivers!: (Driver | string)[];

  isNotificationButtonDisabled = true;  
  isNotificationSendBlockOpen = false;

  @ViewChild('driverInput') driverInput!: ElementRef<HTMLInputElement>;

  constructor(
    private fb: FormBuilder,
    private driverService: DriversService,
    private authService: AuthService, 
    private notificationService: NotificationService,
    private destroyRef: DestroyRef, 
    public snackbarService: SnackbarService,
  ){
    this.notificationForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(50)]], 
      message: ['', [Validators.required, Validators.maxLength(255)]], 
      email: [this.isDriver() ? 'manager@manager.com' : '', [Validators.required]], 
    });
  }

  ngOnInit(): void{
    this.driverService
      .getRegisteredDrivers()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((response) => {
        this.drivers = response;
      });

    this.notificationForm.statusChanges.subscribe(() => {
      this.isNotificationButtonDisabled = this.notificationForm.invalid;
    });
  }

  sendNotification(): void {
    if (this.notificationForm.valid) {
      const formValue = this.notificationForm.value;
      const notification = {
        ...formValue,
        email: typeof formValue.email === 'object' 
              ? formValue.email.email
              : formValue.email
      }; 
      this.notificationService.sendNotification(notification).subscribe({
        next: () => {
          this.resetForm();
        }
      });      
    } else{
      this.snackbarService.openSnackBar("Please fill the form correctly!")
    }
  }

  resetForm(): void {
    this.notificationForm.reset();         
    Object.keys(this.notificationForm.controls).forEach((controlName) => {
      const control = this.notificationForm.get(controlName);
      if (control) {
        control.setErrors(null);
        control.markAsPristine(); 
        control.markAsUntouched(); 
      }
    }); 
  }

  toggleNotificationForm(): void {
    this.isNotificationSendBlockOpen = !this.isNotificationSendBlockOpen;
  }

  isDriver(): boolean {
    return !this.authService.isManager();
  }

  filter(): void {
    const filterValue = this.driverInput.nativeElement.value.toLowerCase();
    this.filteredDrivers = this.drivers.filter((driver) =>
        this.getDriverText(driver).toLowerCase().includes(filterValue)
    );
  }

  getDriverText(driver: Driver | string): string {
    if (typeof driver === 'string') {
        return 'Not assigned';
    }
    return driver.name + ' ' + driver.surname + ', ' + driver.email;
  }

  displayFn(driver: Driver | string): string {
      if (typeof driver === 'string') {
          return driver;
      }
      return driver
          ? driver.name + ' ' + driver.surname + ', ' + driver.email
          : '';
  }  
}
