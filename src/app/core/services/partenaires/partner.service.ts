import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api.service';
import { ApiResponse } from '../../api/ApiResponse';
import { Partner } from '../../models/partner/partner.model';
import { PartnerFormData } from '../../models/partner/partner-form-data.model';
import { PartnerStats } from '../../models/partner/partner-stats.model';
import { Price } from '../../models/price/price.model';


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

  getPartnerStats(): Observable<ApiResponse<PartnerStats>> {
    return this.api.get<PartnerStats>('/partners/stats');
  }

  getPartnerWithDetails(partnerId: string): Observable<ApiResponse<Partner>> {
    return this.api.get<Partner>(`/partners/${partnerId}`);
  }

  togglePartnerStatus(id: string): Observable<ApiResponse<Partner>> {
    return this.api.get<Partner>(`/partners/${id}/toggle-status`);
  }

  getPartnerWithPrices(partnerId: string): Observable<ApiResponse<{partner: Partner, prices: Price[]}>> {
    return this.api.get<{partner: Partner, prices: Price[]}>(`/partners/${partnerId}/prices`);
  }

  searchPartners(query: string): Observable<ApiResponse<Partner[]>> {
    return this.api.get<Partner[]>(`/partners/search?q=${query}`);
  }
  
  deletePartner(partnerId: string): Observable<ApiResponse<void>> {
    return this.api.delete<void>(`/partners/${partnerId}`);
  }

  private createFormData(data: PartnerFormData): FormData {
    const formData = new FormData();
    formData.append('name', data.name);
  
    if (data.website !== undefined && data.website !== null) {
      formData.append('website', data.website);
    }
  
    if (data.description !== undefined && data.description !== null) {
      formData.append('description', data.description);
    }
  
    if (typeof data.isActive === 'boolean') {
      formData.append('isActive', data.isActive.toString());
    }
  
    if (data.imageFile) {
      formData.append('image', data.imageFile);
    }
  
    return formData;
  }
  
}