import { Injectable } from '@angular/core';
import { ApiResponse } from '../../api/ApiResponse';
import { ApiService } from '../api.service';
import { User } from '../../models/user/user-profil.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private endpoint = '/users';

  constructor(private api: ApiService) {}

  // Récupérer tous les utilisateurs
  getUsers(): Observable<ApiResponse<User[]>> {
    return this.api.get<User[]>(this.endpoint);
  }

  getUser(userId: string): Observable<ApiResponse<User>> {
    return this.api.get<User>(`${this.endpoint}/${userId}`);
  }
  
  // Promouvoir un utilisateur admin
  promoteToAdmin(userId: string): Observable<ApiResponse<User>> {
    return this.api.post<User>(`${this.endpoint}/${userId}/promote`, {});
  }

  // Bannir un utilisateur
  banUser(userId: string): Observable<ApiResponse<any>> {
    return this.api.post(`${this.endpoint}/${userId}/ban`, {});
  }

  // Réactiver un utilisateur
  activateUser(userId: string): Observable<ApiResponse<any>> {
    return this.api.post(`${this.endpoint}/${userId}/activate`, {});
  }
}