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
    photoUrls?: string[]; // Add this property to hold URLs of service photos
}

export interface ServicePhoto {
    id: string;
    serviceId: string;
    photoUri: string;
}
