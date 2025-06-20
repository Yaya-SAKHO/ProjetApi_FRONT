import { IComponent } from "../component/component.model";
import { Partner } from "../partner/partner.model";

export interface Price {
    _id: string;
    partner: Partner | string;
    component: IComponent | string;
    price: number;
}