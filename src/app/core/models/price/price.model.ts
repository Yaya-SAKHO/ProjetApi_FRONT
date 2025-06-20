import { Component } from "../component/component.model";
import { Partner } from "../partner/partner.model";

export interface Price {
    _id: string;
    partner: Partner | string;
    component: Component | string;
    price: number;
}