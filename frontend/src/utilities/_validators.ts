import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const PASSWORD_PATTERN =
    '^(?=.*\\d)(?=.*[a-zA-Z])(?=.*[A-Z])(?=.*[\\_\\^\\@\\!\\-\\#\\$\\.\\%\\&\\*])(?=.*[a-zA-Z]).{8,16}$';

export const passwordMatchValidator: ValidatorFn = (
    control: AbstractControl
): ValidationErrors | null => {
    const password = control.get('password')?.value;
    const repeatPassword = control.get('repeatPassword')?.value;
    const mismatch = { mismatch: true };
    if (password !== repeatPassword) {
        control.get('repeatPassword')?.setErrors(mismatch);
        return mismatch;
    }
    control.get('repeatPassword')?.setErrors(null);
    return null;
};
