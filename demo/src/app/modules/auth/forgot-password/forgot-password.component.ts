import { NgIf } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { finalize } from 'rxjs';

@Component({
    selector: 'auth-forgot-password',
    templateUrl: './forgot-password.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    standalone: true,
    imports: [NgIf, FuseAlertComponent, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatProgressSpinnerModule, RouterLink],
})
export class AuthForgotPasswordComponent implements OnInit {
    @ViewChild('forgotPasswordNgForm') forgotPasswordNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    resetPasswordForm: UntypedFormGroup;
    forgotPasswordForm: UntypedFormGroup;
    showAlert: boolean = false;
    showNewPasswordForm: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder,
        private _router: Router,

    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        this.forgotPasswordForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
        });
        this.resetPasswordForm = this._formBuilder.group({
            passwordConfirm: ['', Validators.required],
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Send the reset link
     */
    // sendResetLink(): void
    // {
    //     // Return if the form is invalid
    //     if ( this.forgotPasswordForm.invalid )
    //     {
    //         return;
    //     }

    //     // Disable the form
    //     this.forgotPasswordForm.disable();

    //     // Hide the alert
    //     this.showAlert = false;

    //     // Forgot password
    //     this._authService.forgotPassword(this.forgotPasswordForm.get('email').value)
    //         .pipe(
    //             finalize(() =>
    //             {
    //                 // Re-enable the form
    //                 this.forgotPasswordForm.enable();

    //                 // Reset the form
    //                 this.forgotPasswordNgForm.resetForm();

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
    //                     message: 'Password reset sent! You\'ll receive an email if you are registered on our system.',
    //                 };
    //             },
    //             (response) =>
    //             {
    //                 // Set the alert
    //                 this.alert = {
    //                     type   : 'error',
    //                     message: 'Email does not found! Are you sure you are already a member?',
    //                 };
    //             },
    //         );
    // }

    sendResetLink(): void {
        // Return if the form is invalid
        if (this.forgotPasswordForm.invalid) {
            return;
        }

        // Disable the form
        this.forgotPasswordForm.disable();

        // Hide the alert
        this.showAlert = false;

        // Get the email value from the form
        const email = this.forgotPasswordForm.get('email').value;
        console.log('Email value:', email); // Print the email value to the console

        // Forgot password
        this._authService.forgotPassword(email)
            .pipe(
                finalize(() => {
                    // Re-enable the form
                    this.forgotPasswordForm.enable();

                    // Reset the form
                    this.forgotPasswordNgForm.resetForm();

                    // Show the alert
                    this.showAlert = true;
                    this.showNewPasswordForm = true;
                    // this._router.navigate(['reset-password']);
                }),
            )
            .subscribe(
                (response) => {
                    // Set the alert
                    this.alert = {
                        type: 'success',
                        message: 'Password reset sent! You\'ll receive an email if you are registered on our system.',
                    };
                },
                (response) => {
                    // Set the alert
                    this.alert = {
                        type: 'error',
                        message: 'Email does not found! Are you sure you are already a member?',
                    };
                },
            );
    }
    resetPassword(): void {

        const inputPassword = this.resetPasswordForm.get('passwordConfirm').value;
        const hashedPassword = sessionStorage.getItem('hashedPassword');

        if (hashedPassword) {
            this._authService.comparePassword(inputPassword, hashedPassword).then(isMatch => {
                if (isMatch) {
                    this.alert = {
                        type: 'success',
                        message: 'Passwords match.',
                    };
                    this._router.navigate(['reset-password']);
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
}
