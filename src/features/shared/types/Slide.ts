export interface Slide {
    id: string;
    title: string;         // Title of the slide
    description: string;   // Description of the slide
    imageUrl: string;      // URL of the slide image
    order: number;         // Display order for the slideshow
    createdAt: Date;       // Timestamp when the slide was created
    updatedAt: Date;       // Timestamp when the slide was last updated
}
