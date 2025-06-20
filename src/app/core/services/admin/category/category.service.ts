import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../api.service';
import { Category } from '../../../models/admin/category/category.model';
import { ApiResponse } from '../../../api/ApiResponse';


@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private api: ApiService) { }

  getCategories(): Observable<ApiResponse<Category[]>> {
    return this.api.get<Category[]>('/categories');
  }

  addCategory(name: string): Observable<ApiResponse<Category>> {
    return this.api.post<Category>('/categories', { name });
  }

  updateCategory(id: string, name: string): Observable<ApiResponse<Category>> {
    return this.api.put<Category>(`/categories/${id}`, { name });
  }

  deleteCategory(id: string): Observable<ApiResponse<void>> {
    return this.api.delete<void>(`/categories/${id}`);
  }
}