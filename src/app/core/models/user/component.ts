// src/app/shared/models/component.model.ts
export interface IComponent {
    _id: string;
    name: string;
    category: string;
    brand: string;
    specs: {
        [key: string]: string;
    };
    image?: {
        data?: string;
        contentType?: string;
    };
    price?: number;
}