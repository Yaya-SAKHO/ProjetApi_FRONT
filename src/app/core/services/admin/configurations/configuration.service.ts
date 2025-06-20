import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../api.service';
import { Configuration } from '../../../models/admin/configuration/configuration.model';
import { ApiResponse } from '../../../api/ApiResponse';
import { ConfigurationStats } from '../../../models/admin/configuration/configuration-stats.model';


@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  constructor(private api: ApiService) { }

  createConfiguration(configData: any): Observable<ApiResponse<Configuration>> {
    return this.api.post<Configuration>('/configurations', configData);
  }

  getConfigurationsByUser(email: string): Observable<ApiResponse<Configuration[]>> {
    return this.api.get<Configuration[]>(`/configurations/user/${email}`);
  }

  getConfigurationById(id: string): Observable<ApiResponse<Configuration>> {
    return this.api.get<Configuration>(`/configurations/${id}`);
  }

  updateConfiguration(id: string, configData: any): Observable<ApiResponse<Configuration>> {
    return this.api.put<Configuration>(`/configurations/${id}`, configData);
  }

  deleteConfiguration(id: string): Observable<ApiResponse<void>> {
    return this.api.delete<void>(`/configurations/${id}`);
  }

  // exportToPDF(id: string): Observable<ApiResponse<Blob>> {
  //   return this.api.get<Blob>(`/configurations/${id}/export-pdf`, {
  //     responseType: 'blob'
  //   });
  // }

  getConfigurationsWithUserDetails(): Observable<ApiResponse<Configuration[]>> {
    return this.api.get<Configuration[]>('/configurations');
  }

  getConfigurationStats(): Observable<ApiResponse<ConfigurationStats>> {
    return this.api.get<ConfigurationStats>('/admin/stats/configurations');
  }
}