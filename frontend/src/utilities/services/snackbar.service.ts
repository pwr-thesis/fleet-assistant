import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root',
})
export class SnackbarService {
    constructor(private snackBar: MatSnackBar) {}

    openSnackBar(
        message: string,
        horizontalPosition: 'start' | 'end' = 'start',
        duration = 2000
    ): void {
        this.snackBar.open(message, 'Close', {
            duration,
            horizontalPosition: horizontalPosition,
        });
    }
}
