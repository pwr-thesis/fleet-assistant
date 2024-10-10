import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import moment from 'moment/moment';

export function futureDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        if (value && moment(value).isSameOrAfter(moment())) {
            return null;
        }
        return { past: true };
    };
}

export function pastDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        if (value && moment(value).isBefore(moment())) {
            return null;
        }
        return { future: true };
    };
}

export function yearValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        if (value && (value > 2024 || value < 1940)) {
            return { validYear: true };
        }
        return null;
    };
}
