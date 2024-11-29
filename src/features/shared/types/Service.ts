export interface Service {
    id: string;
    name: string;
    clientId: string;
    description: string;
    date: Date;
    price: number;
    photoUrls?: string[];
}