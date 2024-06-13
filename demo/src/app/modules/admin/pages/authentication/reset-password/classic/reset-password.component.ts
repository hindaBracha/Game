import { NgIf } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
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

@Component({
    selector     : 'reset-password-classic',
    templateUrl  : './reset-password.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations,
    standalone   : true,
    imports      : [NgIf, FuseAlertComponent, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, RouterLink],
})
export class ResetPasswordClassicComponent implements OnInit
{
    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: '',
    };
    message: string = '';

    resetPasswordForm: UntypedFormGroup;
    showAlert: boolean = false;

    /**
     * Constructor
     */
   

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
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

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Reset password
     */
    // resetPassword(): void
    // {
    // }


      
        hashedPassword: string;
    
        constructor(
            private _formBuilder: UntypedFormBuilder,
            private _authService: AuthService,
            private _router: Router,
        ) {}
    
        ngOnInit(): void {
            this.resetPasswordForm = this._formBuilder.group({
                email: ['', [Validators.required, Validators.email]],
                password: ['', Validators.required],
                passwordConfirm: ['', Validators.required],
            }, {
                validators: this.mustMatch('password', 'passwordConfirm')
            });
        }
    
        resetPassword(): void {
            const email = this.resetPasswordForm.get('email').value;
    
            this._authService.sendResetPasswordEmail(email).subscribe(response => {
                this.message = 'Password reset email sent successfully.';
            }, error => {
                this.message = 'Failed to send password reset email.';
            });
        }
    
        comparePasswords(): void {
            const inputPassword = this.resetPasswordForm.get('password').value;
            const hashedPassword = sessionStorage.getItem('hashedPassword');
    
            this._authService.comparePassword(inputPassword, hashedPassword).then(isMatch => {
                if (isMatch) {
                    this.message = 'Passwords match.';
                } else {
                    this.message = 'Passwords do not match.';
                }
            }).catch(error => {
                this.message = 'An error occurred while comparing passwords.';
            });
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
    

        // resetPassword(): void {
        //     const email = this.resetPasswordForm.get('email').value;
    
        //     this._authService.sendResetPasswordEmail(email).subscribe(response => {
        //         this.hashedPassword = response.hashedPassword;
        //         sessionStorage.setItem('hashedPassword', this.hashedPassword);
        //         this.showAlert = true;
        //         this.alert = {
        //             type: 'success',
        //             message: 'Password reset email sent successfully.',
        //         };
        //     }, () => {
        //         this.showAlert = true;
        //         this.alert = {
        //             type: 'error',
        //             message: 'Failed to send password reset email.',
        //         };
        //     });
        // }
    
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
    

