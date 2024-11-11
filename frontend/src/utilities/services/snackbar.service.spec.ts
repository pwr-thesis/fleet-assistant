import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarService } from './snackbar.service';

describe('SnackbarService', () => {
    let snackbarService: SnackbarService;
    let matSnackBarSpy: jasmine.SpyObj<MatSnackBar>;

    beforeEach(() => {
        matSnackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

        TestBed.configureTestingModule({
            providers: [
                SnackbarService,
                { provide: MatSnackBar, useValue: matSnackBarSpy },
            ],
        });

        snackbarService = TestBed.inject(SnackbarService);
    });

    it('should be created', () => {
        expect(snackbarService).toBeTruthy();
    });

    it('should call MatSnackBar open method with correct parameters', () => {
        const message = 'Test Message';
        const horizontalPosition: 'start' | 'end' = 'start';
        const duration = 3000;

        snackbarService.openSnackBar(message, horizontalPosition, duration);

        expect(matSnackBarSpy.open).toHaveBeenCalledWith(message, 'Close', {
            duration,
            horizontalPosition,
        });
    });

    it('should call MatSnackBar open with default values if no duration or position is provided', () => {
        const message = 'Test Message';

        snackbarService.openSnackBar(message);

        expect(matSnackBarSpy.open).toHaveBeenCalledWith(message, 'Close', {
            duration: 2000,
            horizontalPosition: 'start',
        });
    });
});
