// src/app/core/services/configurations/configurations.service.ts
import { Injectable } from '@angular/core';
import { ApiResponse } from '../../api/ApiResponse';
import { ApiService } from '../api.service';
import { Configuration } from '../../models/configuration/configuration.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ConfigurationsService {
  private endpoint = '/configurations';

  constructor(private api: ApiService) {}

  getUserConfigurations(userId: string): Observable<ApiResponse<Configuration[]>> {
    return this.api.get<Configuration[]>(`${this.endpoint}/user/${userId}`);
  }

  // Add other methods as needed
}