import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import moment from 'moment';

export function dateOfBirthValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        if (value && moment().diff(moment(value), 'years') >= 16) {
            return null;
        }
        return { minSixteenYears: true };
    };
}
