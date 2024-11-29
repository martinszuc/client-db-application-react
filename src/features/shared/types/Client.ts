export interface Client {
    id: string;
    name: string;
    phone?: string;
    email?: string;
    profilePictureUrl?: string;
    profilePictureColor?: string;
    latestServiceDate?: Date;
}
