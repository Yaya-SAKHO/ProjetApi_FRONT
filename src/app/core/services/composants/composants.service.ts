import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { ApiResponse } from '../../api/ApiResponse';
import { Component } from '../../models/component/component.model';
import { ApiService } from '../api.service';
import { ComponentFormData } from '../../models/component/component-form-data.model';

@Injectable({
  providedIn: 'root'
})
export class ComponentService {
  constructor(private api: ApiService) { }

  getComponentsByCategory(categoryName: string): Observable<ApiResponse<Component[]>> {
    return this.api.get<Component[]>(`/components/category/${categoryName}`);
  }

  getComponentDetails(id: string): Observable<ApiResponse<Component>> {
    return this.api.get<Component>(`/components/${id}`);
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
    formData.append('specs', JSON.stringify(data.specs));
    if (data.imageFile) {
      formData.append('image', data.imageFile);
    }
    return formData;
  }
}