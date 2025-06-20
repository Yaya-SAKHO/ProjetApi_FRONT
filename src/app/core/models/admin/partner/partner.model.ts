export interface Partner {
    _id: string;
    name: string;
    image?: {
        data: string;
        contentType: string;
    };
    componentCount?: number;
}