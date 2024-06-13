import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private _authenticated: boolean = false;
    private _httpClient = inject(HttpClient);
    private _userService = inject(UserService);
    private readonly _baseUrl: string = 'https://localhost:7130/api/User'; // הכתובת של ה-API האמיתי שלך

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string) {
        localStorage.setItem('accessToken', token);
    }

    get accessToken(): string {
        return localStorage.getItem('accessToken') ?? '';
    }

    set accessTokenToForgot(token: string) {
        localStorage.setItem('accessToken', token);
    }

    get accessTokenToForgot(): string {
        return localStorage.getItem('accessToken') ?? '';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    getAllData(): Observable<any> {
        const resource_id = 'ec172c08-27fe-4d97-960d-dabf741c077f'; // מזהה המשאב
        const limit = 1000; // כמות התוצאות שתרצי לשלוף
        const url = `https://data.gov.il/api/3/action/datastore_search?resource_id=${resource_id}&limit=${limit}`;
        return this._httpClient.get(url);
    }
    // getCitiesInIsrael(): Observable<any> {
    //     const apiKey = 'המפתח_שלך'; // יש להכניס את מפתח ה-API שלך כאן
    //     const country = 'ישראל';
    //     const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${country}&key=${apiKey}`;
    //     return this._httpClient.get(url);
    // }
    forgotPassword(email: string): Observable<any> {
        return this._httpClient.get(`${this._baseUrl}/ForgotPassword?email=${email}`)
        .pipe(
            switchMap((response: any) => {
                sessionStorage.setItem('hashedPassword', response.hashedPassword);
                return of(response);
            })
        );
    }

    resetPassword(password: string): Observable<any> {
        return this._httpClient.post(`${this._baseUrl}/reset-password`, { password });
    }
    // forgotPassword(email: string): Observable<any> {
    //     return this._httpClient.get(`${this._baseUrl}/ForgotPassword?email=${email}`);
    // }

    // resetPassword(password: string): Observable<any> {
    //     return this._httpClient.post(`${this._baseUrl}/reset-password`, password);
    // }

    /**
     * Sign in 🪱 It works
     *
     * @param credentials
     */
    signIn(credentials: { email: string; password: string }): Observable<any> {
        // Throw error, if the user is already logged in
        if (this._authenticated) {
            return throwError('User is already logged in.');
        }

        return this._httpClient.get(`${this._baseUrl}/Login?email=${credentials.email}&password=${credentials.password}`).pipe(
            switchMap((response: any) => {
                // Store the access token in the local storage
                this.accessToken = response.token;

                // Set the authenticated flag to true
                this._authenticated = true;

                // Store the user on the user service
                this._userService.user = response.user;

                // Return a new observable with the response
                return of(response);
            }),
        );
    }

    /**
     * Sign in using the access token
     */
    signInUsingToken(): Observable<any> {
        // Sign in using the token
        return this._httpClient.post(`${this._baseUrl}/sign-in-with-token`, {
            accessToken: this.accessToken,
        }).pipe(
            catchError(() =>

                // Return false
                of(false),
            ),
            switchMap((response: any) => {
                // Replace the access token with the new one if it's available on
                // the response object.
                //
                // This is an added optional step for better security. Once you sign
                // in using the token, you should generate a new one on the server
                // side and attach it to the response object. Then the following
                // piece of code can replace the token with the refreshed one.
                if (response.accessToken) {
                    this.accessToken = response.accessToken;
                }

                // Set the authenticated flag to true
                this._authenticated = true;

                // Store the user on the user service
                this._userService.user = response.user;

                // Return true
                return of(true);
            }),
        );
    }

    /**
     * Sign out 🪱 It works
     */
    signOut(): Observable<any> {
        // Remove the access token from the local storage
        localStorage.removeItem('accessToken');

        // Set the authenticated flag to false
        this._authenticated = false;

        // Return the observable
        return of(true);
    }

    /**
     * Sign up 🪱 It works
     *
     * @param user
     */
    signUp(user: { firstName: string;lastName: string; phoneNumber: string; email: string; password: string; company: string }): Observable<any> {
        return this._httpClient.post(`${this._baseUrl}`, user);
    }

    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: { email: string; password: string }): Observable<any> {
        return this._httpClient.post(`${this._baseUrl}/unlock-session`, credentials);
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean> {
        // Check if the user is logged in
        if (this._authenticated) {
            return of(true);
        }

        // Check the access token availability
        if (!this.accessToken) {
            return of(false);
        }

        // Check the access token expire date
        if (AuthUtils.isTokenExpired(this.accessToken)) {
            return of(false);
        }

        // If the access token exists, and it didn't expire, sign in using it
        return this.signInUsingToken();
    }

    
    sendResetPasswordEmail(email: string): Observable<any> {
        return this._httpClient.get(`${this._baseUrl}/ForgotPassword?email=${email}`)
        .pipe(
            switchMap((response: any) => {
                sessionStorage.setItem('hashedPassword', response.hashedPassword);
                return of(response);
            })
        );
    }

    async hashPassword(password: string): Promise<string> {
        const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password));
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashHex;
    }
    

    async comparePassword(inputPassword: string, hashedPassword: string): Promise<boolean> {
        const hashedInputPassword = await this.hashPassword(inputPassword);
        return hashedInputPassword === hashedPassword;
    }
    
}



// import { HttpClient } from '@angular/common/http';
// import { inject, Injectable } from '@angular/core';
// import { AuthUtils } from 'app/core/auth/auth.utils';
// import { UserService } from 'app/core/user/user.service';
// import { catchError, Observable, of, switchMap, throwError } from 'rxjs';

// @Injectable({providedIn: 'root'})
// export class AuthService
// {
//     private _authenticated: boolean = false;
//     private _httpClient = inject(HttpClient);
//     private _userService = inject(UserService);

//     // -----------------------------------------------------------------------------------------------------
//     // @ Accessors
//     // -----------------------------------------------------------------------------------------------------

//     /**
//      * Setter & getter for access token
//      */
//     set accessToken(token: string)
//     {
//         localStorage.setItem('accessToken', token);
//     }

//     get accessToken(): string
//     {
//         return localStorage.getItem('accessToken') ?? '';
//     }

//     // -----------------------------------------------------------------------------------------------------
//     // @ Public methods
//     // -----------------------------------------------------------------------------------------------------

//     /**
//      * Forgot password
//      *
//      * @param email
//      */
//     forgotPassword(email: string): Observable<any>
//     {
//         return this._httpClient.post('api/auth/forgot-password', email);
//     }

//     /**
//      * Reset password
//      *
//      * @param password
//      */
//     resetPassword(password: string): Observable<any>
//     {
//         return this._httpClient.post('api/auth/reset-password', password);
//     }

//     /**
//      * Sign in
//      *
//      * @param credentials
//      */
//     signIn(credentials: { email: string; password: string }): Observable<any>
//     {
//         // Throw error, if the user is already logged in
//         if ( this._authenticated )
//         {
//             return throwError('User is already logged in.');
//         }

//         return this._httpClient.post('api/auth/sign-in', credentials).pipe(
//             switchMap((response: any) =>
//             {
//                 // Store the access token in the local storage
//                 this.accessToken = response.accessToken;

//                 // Set the authenticated flag to true
//                 this._authenticated = true;

//                 // Store the user on the user service
//                 this._userService.user = response.user;

//                 // Return a new observable with the response
//                 return of(response);
//             }),
//         );
//     }

//     /**
//      * Sign in using the access token
//      */
//     signInUsingToken(): Observable<any>
//     {
//         // Sign in using the token
//         return this._httpClient.post('api/auth/sign-in-with-token', {
//             accessToken: this.accessToken,
//         }).pipe(
//             catchError(() =>

//                 // Return false
//                 of(false),
//             ),
//             switchMap((response: any) =>
//             {
//                 // Replace the access token with the new one if it's available on
//                 // the response object.
//                 //
//                 // This is an added optional step for better security. Once you sign
//                 // in using the token, you should generate a new one on the server
//                 // side and attach it to the response object. Then the following
//                 // piece of code can replace the token with the refreshed one.
//                 if ( response.accessToken )
//                 {
//                     this.accessToken = response.accessToken;
//                 }

//                 // Set the authenticated flag to true
//                 this._authenticated = true;

//                 // Store the user on the user service
//                 this._userService.user = response.user;

//                 // Return true
//                 return of(true);
//             }),
//         );
//     }

//     /**
//      * Sign out
//      */
//     signOut(): Observable<any>
//     {
//         // Remove the access token from the local storage
//         localStorage.removeItem('accessToken');

//         // Set the authenticated flag to false
//         this._authenticated = false;

//         // Return the observable
//         return of(true);
//     }

//     /**
//      * Sign up
//      *
//      * @param user
//      */
//     signUp(user: { name: string; email: string; password: string; company: string }): Observable<any>
//     {
//         return this._httpClient.post('api/auth/sign-up', user);
//     }

//     /**
//      * Unlock session
//      *
//      * @param credentials
//      */
//     unlockSession(credentials: { email: string; password: string }): Observable<any>
//     {
//         return this._httpClient.post('api/auth/unlock-session', credentials);
//     }

//     /**
//      * Check the authentication status
//      */
//     check(): Observable<boolean>
//     {
//         // Check if the user is logged in
//         if ( this._authenticated )
//         {
//             return of(true);
//         }

//         // Check the access token availability
//         if ( !this.accessToken )
//         {
//             return of(false);
//         }

//         // Check the access token expire date
//         if ( AuthUtils.isTokenExpired(this.accessToken) )
//         {
//             return of(false);
//         }

//         // If the access token exists, and it didn't expire, sign in using it
//         return this.signInUsingToken();
//     }
// }
