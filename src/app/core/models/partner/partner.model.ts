export interface Partner {
    id: string;
    _id?: string;
    name: string;
    website?: string; // Nouveau champ
    description?: string; // Nouveau champ
    image?: {
        data: string;
        contentType: string;
    };
    componentCount?: number;
    priceCount?: number; // Nouvelle propriété utile
    isActive?: boolean; // Pour activer/désactiver un partenaire
    createdAt?: Date; // Date de création
    updatedAt?: Date; // Date de mise à jour
}