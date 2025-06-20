import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api.service';
import { ApiResponse } from '../../api/ApiResponse';
import { Partner } from '../../models/partner/partner.model';
import { PartnerFormData } from '../../models/partner/partner-form-data.model';
import { PartnerStats } from '../../models/partner/partner-stats.model';


@Injectable({
  providedIn: 'root'
})
export class PartnerService {
  constructor(private api: ApiService) { }

  getPartners(): Observable<ApiResponse<Partner[]>> {
    return this.api.get<Partner[]>('/partners');
  }

  addPartner(partnerData: PartnerFormData): Observable<ApiResponse<Partner>> {
    const formData = this.createFormData(partnerData);
    return this.api.postFormData<Partner>('/partners', formData);
  }

  updatePartner(id: string, partnerData: PartnerFormData): Observable<ApiResponse<Partner>> {
    const formData = this.createFormData(partnerData);
    return this.api.putFormData<Partner>(`/partners/${id}`, formData);
  }

  deletePartner(id: string): Observable<ApiResponse<void>> {
    return this.api.delete<void>(`/partners/${id}`);
  }

  getPartnerStats(): Observable<ApiResponse<PartnerStats>> {
    return this.api.get<PartnerStats>('/partners/stats');
  }

  // togglePartnerStatus(id: string): Observable<ApiResponse<Partner>> {
  //   return this.api.put<Partner>(`/partners/${id}/toggle-status`);
  // }

  searchPartners(query: string): Observable<ApiResponse<Partner[]>> {
    return this.api.get<Partner[]>(`/partners/search?q=${query}`);
  }

  getPartnerWithDetails(id: string): Observable<ApiResponse<Partner>> {
    return this.api.get<Partner>(`/partners/${id}/details`);
  }

  private createFormData(data: PartnerFormData): FormData {
    const formData = new FormData();
    formData.append('name', data.name);
    if (data.imageFile) {
      formData.append('image', data.imageFile);
    }
    return formData;
  }
}