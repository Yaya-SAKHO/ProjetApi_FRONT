import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../api/ApiResponse';
import { Price } from '../../models/price/price.model';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class PriceService {
  constructor(private api: ApiService) { }

  getPricesForAllComponents(): Observable<ApiResponse<any[]>> {
    return this.api.get<any[]>('/prices');
  }

  getPricesByComponent(componentId: string): Observable<ApiResponse<Price[]>> {
    return this.api.get<Price[]>(`/prices/component/${componentId}`);
  }

  calculateTotalCost(componentIds: string[]): Observable<ApiResponse<{ totalCost: number }>> {
    return this.api.post<{ totalCost: number }>('/prices/calculate-cost', componentIds);
  }

  addPrice(priceData: Price): Observable<ApiResponse<Price>> {
    return this.api.post<Price>('/prices', priceData);
  }

  updatePrice(priceData: Price): Observable<ApiResponse<Price>> {
    return this.api.put<Price>('/prices', priceData);
  }

//   deletePrice(partnerId: string, componentId: string): Observable<ApiResponse<void>> {
//     return this.api.delete<void>('/prices', {
//       params: { partnerId, componentId }
//     });
//   }
}