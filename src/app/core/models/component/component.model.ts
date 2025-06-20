import { Category } from "../category/category.model";
import { Price } from "../price/price.model";
import { ComponentSpecs } from "./component-specs.model";

export interface IComponent {
    _id: string;
    id?: string;
    name: string;
    category: Category | string;
    brand: string;
    specs: ComponentSpecs;
    image?: {
        data: string;
        contentType: string;
    };
    prices?: Price[];
    imageUrl?: string;
}