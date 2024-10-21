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

export const CUSTOM_DATEFORMAT = {
    parse: {
        dateInput: 'DD/MM/YYYY',
    },
    display: {
        dateInput: 'DD/MM/YYYY',
        monthYearLabel: 'MMMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};
