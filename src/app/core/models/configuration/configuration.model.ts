import { User } from "../user/user-profil.model";

export interface Configuration {
    id: string;
    user: string | User;
    name: string;
    components: any[];
    createdAt?: Date;
  }