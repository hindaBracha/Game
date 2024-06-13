import { NgIf } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormsModule, NgForm, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { FuseValidators } from '@fuse/validators';
import { AuthService } from 'app/core/auth/auth.service';
import { finalize } from 'rxjs';

@Component({
    selector: 'auth-reset-password',
    templateUrl: './reset-password.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    standalone: true,
    imports: [NgIf, FuseAlertComponent, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, RouterLink],
})
export class AuthResetPasswordComponent implements OnInit {
    @ViewChild('resetPasswordNgForm') resetPasswordNgForm: NgForm;
    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    resetPasswordForm: UntypedFormGroup;
    showAlert: boolean = false;
    hashedPassword: string;
    newPasswordForm: UntypedFormGroup;
    showNewPasswordForm: boolean = false;

    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _authService: AuthService,
        private _router: Router,
    ) { }

    ngOnInit(): void {

        this.newPasswordForm = this._formBuilder.group({
            password: ['', Validators.required],
            passwordConfirm: ['', Validators.required],
        }, {
            validators: this.mustMatch('password', 'passwordConfirm')
        });
    }



  /**
  * Reset password
  */
    resetPassword(): void {
        // Return if the form is invalid
        if (this.resetPasswordForm.invalid) {
            return;
        }

        // Disable the form
        this.resetPasswordForm.disable();

        // Hide the alert
        this.showAlert = false;

        // Send the request to the server
        this._authService.resetPassword(this.resetPasswordForm.get('password').value)
            .pipe(
                finalize(() => {
                    // Re-enable the form
                    this.resetPasswordForm.enable();

                    // Reset the form
                    this.resetPasswordNgForm.resetForm();

                    // Show the alert
                    this.showAlert = true;
                }),
            )
            .subscribe(
                (response) => {
                    // Set the alert
                    this.alert = {
                        type: 'success',
                        message: 'Your password has been reset.',
                    };
                },
                (response) => {
                    // Set the alert
                    this.alert = {
                        type: 'error',
                        message: 'Something went wrong, please try again.',
                    };
                },
            );
    }

    private mustMatch(controlName: string, matchingControlName: string) {
        return (formGroup: FormGroup) => {
            const control = formGroup.controls[controlName];
            const matchingControl = formGroup.controls[matchingControlName];

            if (matchingControl.errors && !matchingControl.errors.mustMatch) {
                return;
            }

            if (control.value !== matchingControl.value) {
                matchingControl.setErrors({ mustMatch: true });
            } else {
                matchingControl.setErrors(null);
            }
        };
    }

    // /////////////////////////////////////////////////////////////////


    // // -----------------------------------------------------------------------------------------------------
    // // @ Public methods
    // // -----------------------------------------------------------------------------------------------------

    // /**
    //  * Reset password
    //  */
    // resetPassword(): void
    // {
    //     // Return if the form is invalid
    //     if ( this.resetPasswordForm.invalid )
    //     {
    //         return;
    //     }

    //     // Disable the form
    //     this.resetPasswordForm.disable();

    //     // Hide the alert
    //     this.showAlert = false;
    //     const inputPassword = this.resetPasswordForm.get('password').value;
    //     const hashedPassword = sessionStorage.getItem('hashedPassword');

    //     this._authService.comparePassword(inputPassword, hashedPassword).then(isMatch => {
    //         if (isMatch) {
    //             this.alert = {
    //                 type: 'success',
    //                 message: 'Passwords match.',
    //             };
    //         } else {
    //             this.alert = {
    //                 type: 'error',
    //                 message: 'Passwords do not match.',
    //             };
    //         }
    //         this.showAlert = true;
    //     });

    //     // Send the request to the server
    //     // this._authService.resetPassword(this.resetPasswordForm.get('password').value)
    //     //     .pipe(
    //     //         finalize(() =>
    //     //         {
    //     //             // Re-enable the form
    //     //             this.resetPasswordForm.enable();

    //     //             // Reset the form
    //     //             this.resetPasswordNgForm.resetForm();

    //     //             // Show the alert
    //     //             this.showAlert = true;
    //     //         }),
    //     //     )
    //     //     .subscribe(
    //     //         (response) =>
    //     //         {
    //     //             // Set the alert
    //     //             this.alert = {
    //     //                 type   : 'success',
    //     //                 message: 'Your password has been reset.',
    //     //             };
    //     //         },
    //     //         (response) =>
    //     //         {
    //     //             // Set the alert
    //     //             this.alert = {
    //     //                 type   : 'error',
    //     //                 message: 'Something went wrong, please try again.',
    //     //             };
    //     //         },
    //     //     );
    // }
    // // resetPassword(): void {
    //     // const email = this.resetPasswordForm.get('email').value;

    //     // this._authService.sendResetPasswordEmail(email).subscribe(response => {
    //     //     this.hashedPassword = response.hashedPassword;
    //     //     sessionStorage.setItem('hashedPassword', this.hashedPassword);
    //     //     this.showAlert = true;
    //     //     this.alert = {
    //     //         type: 'success',
    //     //         message: 'Password reset email sent successfully.',
    //     //     };
    //     // }, () => {
    //     //     this.showAlert = true;
    //     //     this.alert = {
    //     //         type: 'error',
    //     //         message: 'Failed to send password reset email.',
    //     //     };
    //     // });
    // // }

    // private mustMatch(controlName: string, matchingControlName: string) {
    //     return (formGroup: UntypedFormGroup) => {
    //         const control = formGroup.controls[controlName];
    //         const matchingControl = formGroup.controls[matchingControlName];

    //         if (matchingControl.errors && !matchingControl.errors.mustMatch) {
    //             return;
    //         }

    //         if (control.value !== matchingControl.value) {
    //             matchingControl.setErrors({ mustMatch: true });
    //         } else {
    //             matchingControl.setErrors(null);
    //         }
    //     };
    // }

    // comparePassword(): void {
    //     const inputPassword = this.resetPasswordForm.get('password').value;
    //     const hashedPassword = sessionStorage.getItem('hashedPassword');

    //     this._authService.comparePassword(inputPassword, hashedPassword).then(isMatch => {
    //         if (isMatch) {
    //             this.alert = {
    //                 type: 'success',
    //                 message: 'Passwords match.',
    //             };
    //         } else {
    //             this.alert = {
    //                 type: 'error',
    //                 message: 'Passwords do not match.',
    //             };
    //         }
    //         this.showAlert = true;
    //     });
    // }
}
// alert: { type: FuseAlertType; message: string } = {
//     type   : 'success',
//     message: '',
// };
// resetPasswordForm: UntypedFormGroup;
// showAlert: boolean = false;

// /**
//  * Constructor
//  */
// constructor(
//     private _authService: AuthService,
//     private _formBuilder: UntypedFormBuilder,
// )
// {
// }

// // -----------------------------------------------------------------------------------------------------
// // @ Lifecycle hooks
// // -----------------------------------------------------------------------------------------------------

// /**
//  * On init
//  */
// ngOnInit(): void
// {
//     // Create the form
//     this.resetPasswordForm = this._formBuilder.group({
//             password       : ['', Validators.required],
//             passwordConfirm: ['', Validators.required],
//         },
//         {
//             validators: FuseValidators.mustMatch('password', 'passwordConfirm'),
//         },
//     );
// }

// // -----------------------------------------------------------------------------------------------------
// // @ Public methods
// // -----------------------------------------------------------------------------------------------------

// /**
//  * Reset password
//  */
// resetPassword(): void
// {
//     // Return if the form is invalid
//     if ( this.resetPasswordForm.invalid )
//     {
//         return;
//     }

//     // Disable the form
//     this.resetPasswordForm.disable();

//     // Hide the alert
//     this.showAlert = false;

//     // Send the request to the server
//     this._authService.resetPassword(this.resetPasswordForm.get('password').value)
//         .pipe(
//             finalize(() =>
//             {
//                 // Re-enable the form
//                 this.resetPasswordForm.enable();

//                 // Reset the form
//                 this.resetPasswordNgForm.resetForm();

//                 // Show the alert
//                 this.showAlert = true;
//             }),
//         )
//         .subscribe(
//             (response) =>
//             {
//                 // Set the alert
//                 this.alert = {
//                     type   : 'success',
//                     message: 'Your password has been reset.',
//                 };
//             },
//             (response) =>
//             {
//                 // Set the alert
//                 this.alert = {
//                     type   : 'error',
//                     message: 'Something went wrong, please try again.',
//                 };
//             },
//         );
// }
// }

/*
import { NgIf } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormsModule, NgForm, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { FuseValidators } from '@fuse/validators';
import { AuthService } from 'app/core/auth/auth.service';
import { finalize } from 'rxjs';

@Component({
    selector: 'auth-reset-password',
    templateUrl: './reset-password.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    standalone: true,
    imports: [NgIf, FuseAlertComponent, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, RouterLink],
})
export class AuthResetPasswordComponent implements OnInit {
    @ViewChild('resetPasswordNgForm') resetPasswordNgForm: NgForm;
    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    resetPasswordForm: UntypedFormGroup;
    showAlert: boolean = false;
    hashedPassword: string;
    newPasswordForm: UntypedFormGroup;
    showNewPasswordForm: boolean = false;

    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _authService: AuthService,
        private _router: Router,
    ) { }

    ngOnInit(): void {
        this.resetPasswordForm = this._formBuilder.group({
            confirmMailPassword: ['', [Validators.required]],
        });
        this.newPasswordForm = this._formBuilder.group({
            password: ['', Validators.required],
            passwordConfirm: ['', Validators.required],
        }, {
            validators: this.mustMatch('password', 'passwordConfirm')
        });
    }



    resetPassword(): void {

        const inputPassword = this.resetPasswordForm.get('confirmMailPassword').value;
        const hashedPassword = sessionStorage.getItem('hashedPassword');

        if (hashedPassword) {
            this._authService.comparePassword(inputPassword, hashedPassword).then(isMatch => {
                if (isMatch) {
                    this.alert = {
                        type: 'success',
                        message: 'Passwords match.',
                    };
                    this.showNewPasswordForm = true;

                } else {
                    this.alert = {
                        type: 'error',
                        message: 'Passwords do not match.',
                    };
                }
                this.showAlert = true;
            });

        }

        

    }


    private mustMatch(controlName: string, matchingControlName: string) {
        return (formGroup: FormGroup) => {
            const control = formGroup.controls[controlName];
            const matchingControl = formGroup.controls[matchingControlName];

            if (matchingControl.errors && !matchingControl.errors.mustMatch) {
                return;
            }

            if (control.value !== matchingControl.value) {
                matchingControl.setErrors({ mustMatch: true });
            } else {
                matchingControl.setErrors(null);
            }
        };
    }
*/
