import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IComponent } from '../core/models/user/component';

@Injectable({
  providedIn: 'root'
})
export class ComponentService {
  private apiUrl = 'http://localhost:5000/api/components';

  constructor(private http: HttpClient) {}

  getComponentsByCategory(categoryName: string): Observable<IComponent[]> {
    return this.http.get<IComponent[]>(`${this.apiUrl}/category/${categoryName}`);
  }

  getComponentById(id: string): Observable<IComponent> {
    return this.http.get<IComponent>(`${this.apiUrl}/${id}`);
  }
}