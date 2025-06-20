import { Component } from "../component/component.model";
import { User } from "../admin/user/user.model";

export interface Configuration {
  _id: string;
  name: string;
  user: User | string;
  components: (Component | string)[];
  createdAt: Date;
  totalCost?: number;
}