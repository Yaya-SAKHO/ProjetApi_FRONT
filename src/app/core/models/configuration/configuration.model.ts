import {IComponent } from "../component/component.model";
import { User } from "../user.model";

export interface Configuration {
  _id: string;
  name: string;
  user: User | string;
  components: (IComponent | string)[];
  createdAt: Date;
  totalCost?: number;
}