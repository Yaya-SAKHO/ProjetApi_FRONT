import { User } from "../user/user-profil.model";

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  user: User; 
}
