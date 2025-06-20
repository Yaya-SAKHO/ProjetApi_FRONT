import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { finalize, forkJoin } from 'rxjs';
import { Configuration } from '../../../../core/models/configuration/configuration.model';
import { User } from '../../../../core/models/admin/user/user.model';
import { Component as PcComponent } from '../../../../core/models/component/component.model';
import { ConfigurationService } from '../../../../core/services/configurations/configuration.service';
import { ApiResponse } from '../../../../core/api/ApiResponse';
import { PriceService } from '../../../../core/services/price/price.service';
import { ComponentService } from '../../../../core/services/composants/composants.service';
import { Category } from '../../../../core/models/category/category.model';
import { UserService } from '../../../../core/services/utilisateurs/utilisateurs';

@Component({
  selector: 'app-configuration-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './configuration-detail.html',
  styleUrls: ['./configuration-detail.css']
})
export class ConfigurationDetail implements OnInit {
  configuration: Configuration | null = null;
  isLoading = true;
  componentDetails: PcComponent[] = [];
  costBreakdown: { category: string, total: number }[] = [];
  userDetails: User | null = null;

  constructor(
    private route: ActivatedRoute,
    private configService: ConfigurationService,
    private componentService: ComponentService,
    private priceService: PriceService,
    private userService: UserService 
  ) {}

  ngOnInit(): void {
    const configId = this.route.snapshot.paramMap.get('id');
    if (configId) {
      this.loadConfiguration(configId);
    }
  }

  loadConfiguration(id: string): void {
    this.isLoading = true;
    this.configService.getConfigurationById(id).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (response: ApiResponse<Configuration>) => {
        this.configuration = response.Data || null;
        if (this.configuration) {
          this.loadComponentDetails();
          this.loadUserDetails();
        }
      },
      error: (err) => {
        console.error('Erreur chargement configuration', err);
        this.configuration = null;
      }
    });
  }

  loadUserDetails(): void {
    if (!this.configuration) return;
    
    if (typeof this.configuration.user !== 'string') {
      this.userDetails = this.configuration.user;
      return;
    }
    this.userService.getUserById(this.configuration.user).subscribe({
      next: (response: ApiResponse<User>) => {
        this.userDetails = response.Data || null;
        if (this.configuration && this.userDetails) {
          this.configuration.user = this.userDetails;
        }
      },
      error: (err) => console.error('Erreur chargement utilisateur', err)
    });
  }
  
  loadComponentDetails(): void {
    if (!this.configuration) return;
  
    const componentIds = this.configuration.components.map(c => 
      typeof c === 'string' ? c : c._id
    );
  
    forkJoin(
      componentIds.map(id => this.componentService.getComponentDetails(id))
    ).subscribe({
      next: (responses: ApiResponse<any>[]) => {
        this.componentDetails = responses.map(r => r.Data?.component || r.Data);
        console.log('Processed components:', this.componentDetails); 
        this.calculateCostBreakdown();
      },
      error: (err) => console.error('Erreur chargement composants', err)
    });
  }



  calculateCostBreakdown(): void {
    if (!this.configuration) return;

    const componentIds = this.componentDetails.map(c => c._id);

    // Coût total global
    this.priceService.calculateTotalCost(componentIds).subscribe({
      next: (response) => {
        if (this.configuration) {
          this.configuration.totalCost = response.Data?.totalCost || 0;
        }
      }
    });

    // Coût par catégorie
    const breakdown: { [key: string]: number } = {};

    this.componentDetails.forEach(component => {
      const category = typeof component.category === 'string'
        ? component.category
        : component.category.name;

      this.priceService.getPricesByComponent(component._id).subscribe({
        next: (priceResponse) => {
          const prices = priceResponse.Data || [];
          const minPrice = prices.length > 0 ? Math.min(...prices.map(p => p.price)) : 0;
          breakdown[category] = (breakdown[category] || 0) + minPrice;

          this.costBreakdown = Object.keys(breakdown).map(key => ({
            category: key,
            total: breakdown[key]
          }));
        }
      });
    });
  }

  getComponentCategory(component: any): string {
    if (!component) return '';
    if (component.component && component.component.category) {
      return component.component.category.name;
    }
    if (component.category) {
      return typeof component.category === 'string' ? component.category : component.category.name;
    }
    return '';
  }

  getComponentPrice(component: any): number {
    if (!component?.component?.prices || component.component.prices.length === 0) {
      return 0;
    }
    return Math.min(...component.component.prices.map((p: any) => p.price));
  }

  exportToPdf(): void {
    if (!this.configuration) return;

    this.configService.exportToPDF(this.configuration._id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `configuration_${this.configuration?.name}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => console.error('Erreur export PDF', err)
    });
  }

  updateConfiguration(): void {
    if (!this.configuration) return;

    this.configService.updateConfiguration(
      this.configuration._id,
      {
        name: this.configuration.name,
        components: this.configuration.components.map(c =>
          typeof c === 'string' ? c : c._id
        )
      }
    ).subscribe({
      next: () => alert('Configuration mise à jour avec succès'),
      error: (err) => console.error('Erreur mise à jour', err)
    });
  }


}
