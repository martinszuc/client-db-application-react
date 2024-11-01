export interface Client {
    id: string;
    name: string;
    phone?: string;
    email?: string;
    profilePictureUrl?: string;
    profilePictureColor?: string;
    latestServiceDate?: Date;
}

export interface Service {
    id: string;
    clientId: string;
    description: string;
    date: Date;
    price: number;
}

export interface ServicePhoto {
    id: string;
    serviceId: string;
    photoUri: string;
}
