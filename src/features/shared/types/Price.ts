export interface Price {
    id: string;
    title: string;
    shortDescription: string;
    fullDescription: string;
    price?: number | null; // Make price optional or nullable
    currency: string;
    photoUrls: string[]; // URLs of images stored in Firebase Storage
}