import { ComponentSpecs } from "./component-specs.model";

export interface ComponentFormData {
    name: string;
    category: string;
    brand: string;
    specs: ComponentSpecs;
    imageFile?: File;
}