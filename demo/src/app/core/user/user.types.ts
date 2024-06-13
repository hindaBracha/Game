export interface User
{
    id?: string;
    firstName?: string;
    lastName?: string;
    password?: string;
    phoneNumber?: string;
    email?: string;
    howKnownId?: number;
    city?: number;
    genderId?: number;
    avatar?: string | 'hinda.png';
    status?: string;
}
