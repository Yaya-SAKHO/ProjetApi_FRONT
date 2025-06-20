
import { Component, OnInit } from '@angular/core';
import { Component as PcComponent } from '../../../core/models/component/component.model';
import { UserStats } from '../../../core/models/admin/user/user-stats.model';
import { ConfigurationStats } from '../../../core/models/configuration/configuration-stats.model';
import { PartnerStats } from '../../../core/models/partner/partner-stats.model';
import { User } from '../../../core/models/admin/user/user.model';
import { Category } from '../../../core/models/category/category.model';
import { Configuration } from '../../../core/models/configuration/configuration.model';
import { Partner } from '../../../core/models/partner/partner.model';
import { UserService } from '../../../core/services/utilisateurs/utilisateurs';
import { CategoryService } from '../../../core/services/category/category.service';
import { ComponentService } from '../../../core/services/composants/composants.service';
import { ConfigurationService } from '../../../core/services/configurations/configuration.service';
import { PartnerService } from '../../../core/services/partenaires/partner.service';
import { PriceService } from '../../../core/services/price/price.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.scss'],
  imports: [CommonModule, RouterModule, FormsModule],
})
export class AdminDashboard implements OnInit {
  isLoading = true;
  userStats?: UserStats;
  configStats?: ConfigurationStats;
  partnerStats?: PartnerStats;
  
  recentUsers: User[] = [];
  categories: Category[] = [];
  recentComponents: PcComponent[] = [];
  recentConfigurations: Configuration[] = [];
  partners: Partner[] = [];

  constructor(
    private userService: UserService,
    private categoryService: CategoryService,
    private componentService: ComponentService,
    private configurationService: ConfigurationService,
    private partnerService: PartnerService,
    private priceService: PriceService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    
    // Chargement des statistiques
    this.userService.getUserStats().subscribe({
      next: (response) => this.userStats = response.Data!,
      error: (error) => console.error('Error loading user stats', error)
    });

    this.configurationService.getConfigurationStats().subscribe({
      next: (response) => this.configStats = response.Data!,
      error: (error) => console.error('Error loading config stats', error)
    });

    this.partnerService.getPartnerStats().subscribe({
      next: (response) => this.partnerStats = response.Data!,
      error: (error) => console.error('Error loading partner stats', error)
    });

    // Chargement des données récentes
    this.userService.getUsers().subscribe({
      next: (response) => {
        this.recentUsers = response.Data!.slice(0, 5).sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      },
      error: (error) => console.error('Error loading recent users', error)
    });

    this.categoryService.getCategories().subscribe({
      next: (response) => this.categories = response.Data!,
      error: (error) => console.error('Error loading categories', error)
    });

    // this.componentService.getComponentsByCategory('').subscribe({
    //   next: (response) => {
    //     this.recentComponents = response.Data!.slice(0, 5).sort((a, b) => 
    //       //new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    //     );
    //   },
    //   error: (error) => console.error('Error loading recent components', error)
    // });

    this.configurationService.getConfigurationsWithUserDetails().subscribe({
      next: (response) => {
        this.recentConfigurations = response.Data!.slice(0, 5).sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      },
      error: (error) => console.error('Error loading recent configs', error)
    });

    this.partnerService.getPartners().subscribe({
      next: (response) => {
        this.partners = response.Data!;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading partners', error);
        this.isLoading = false;
      }
    });
  }

  getCategoryName(component: PcComponent): string {
    return typeof component.category === 'string' ? 
      component.category : 
      (component.category as Category).name;
  }
}