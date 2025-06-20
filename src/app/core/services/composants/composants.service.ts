import { Injectable } from '@angular/core';

import { Observable, tap, throwError } from 'rxjs';
import { ApiResponse } from '../../api/ApiResponse';
import { Component } from '../../models/component/component.model';
import { ApiService } from '../api.service';
import { ComponentFormData } from '../../models/component/component-form-data.model';

@Injectable({
  providedIn: 'root'
})
export class ComponentService {
  constructor(private api: ApiService) { }

  getAllComponents(): Observable<ApiResponse<Component[]>> {
    return this.api.get<Component[]>('/components');
  }

  getComponentsByCategory(categoryName: string): Observable<ApiResponse<Component[]>> {
    return this.api.get<Component[]>(`/components/category/${categoryName}`);
  }

  getComponentDetails(id: string): Observable<ApiResponse<Component>> {
    console.log('Fetching component with ID:', id); // Debug
    if (!id || id === 'undefined') {
      return throwError(() => new Error('ID de composant invalide'));
    }
    return this.api.get<Component>(`/components/${id}`).pipe(
      tap(response => console.log('API Response:', response)) // Debug
    );
  }

  addComponent(componentData: ComponentFormData): Observable<ApiResponse<Component>> {
    const formData = this.createFormData(componentData);
    return this.api.postFormData<Component>('/components', formData);
  }

  updateComponent(id: string, componentData: ComponentFormData): Observable<ApiResponse<Component>> {
    const formData = this.createFormData(componentData);
    return this.api.putFormData<Component>(`/components/${id}`, formData);
  }

  deleteComponent(id: string): Observable<ApiResponse<void>> {
    return this.api.delete<void>(`/components/${id}`);
  }

  private createFormData(data: ComponentFormData): FormData {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('category', data.category);
    formData.append('brand', data.brand);

    if (data.specs) {
      const specs = typeof data.specs === 'string' ? data.specs : JSON.stringify(data.specs);
      formData.append('specs', specs);
    } else {
      formData.append('specs', JSON.stringify({}));
    }

    if (data.imageFile) {
      formData.append('image', data.imageFile);
    }
    return formData;
  }
}
