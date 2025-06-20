import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { ApiService } from '../api.service';
import { ApiResponse } from '../../api/ApiResponse';
import { User } from '../../models/admin/user/user.model';
import { UserStats } from '../../models/admin/user/user-stats.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private api: ApiService) { }

  getUsers(): Observable<ApiResponse<User[]>> {
    return this.api.get<User[]>('/users');
  }

  getUserById(userId: string): Observable<ApiResponse<User>> {
    return this.api.get<User>(`/users/${userId}`);
  }  

  getUserStats(): Observable<ApiResponse<UserStats>> {
    return this.api.get<UserStats>('/admin/stats/users');
  }

  updateUserRole(userId: string, role: 'admin' | 'user'): Observable<ApiResponse<User>> {
    return this.api.put<User>(`/users/${userId}/role`, { role });
  }

  toggleUserStatus(userId: string, isActive: boolean): Observable<ApiResponse<User>> {
    return this.api.put<User>(`/users/${userId}/status`, { isActive });
  }
}