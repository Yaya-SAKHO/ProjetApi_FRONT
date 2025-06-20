import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { UserService } from '../../../core/services/utilisateurs/utilisateurs';
import { ConfigurationService } from '../../../core/services/configurations/configuration.service';
import { PartnerService } from '../../../core/services/partenaires/partner.service';
import { CategoryService } from '../../../core/services/category/category.service';
import { Configuration } from '../../../core/models/configuration/configuration.model';
import { Partner } from '../../../core/models/partner/partner.model';
import { Price } from '../../../core/models/price/price.model';
import { Category } from '../../../core/models/category/category.model';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.scss'],
  imports: [CommonModule, RouterModule, FormsModule],
})
export class AdminDashboard implements OnInit {
  isLoading = true;

  // Utilisateur
  totalUsers = 0;
  activeUsers = 0;
  adminCount = 0;

  // Configuration
  totalConfigurations = 0;
  averageComponentsPerConfig = 0;

  // Partenaires
  totalPartners = 0;
  activePartners = 0;
  averagePricesPerPartner = 0;

  categories: Category[] = [];

  constructor(
    private userService: UserService,
    private configurationService: ConfigurationService,
    private partnerService: PartnerService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;

    // Utilisateurs
    this.userService.getUsers().subscribe({
      next: (res) => {
        const users: User[] = res.Data || [];
        this.totalUsers = users.length;
        this.activeUsers = users.filter(u => u.isActive).length;
        this.adminCount = users.filter(u => u.role === 'admin').length;
      },
      error: (err) => console.error('Erreur chargement utilisateurs', err)
    });

    // Configurations
    this.configurationService.getConfigurationsWithUserDetails().subscribe({
      next: (res) => {
        const configs: Configuration[] = res.Data || [];
        this.totalConfigurations = configs.length;

        const totalComponents = configs.reduce((sum, c) => sum + (c.components?.length || 0), 0);
        this.averageComponentsPerConfig = configs.length > 0 ? totalComponents / configs.length : 0;
      },
      error: (err) => console.error('Erreur chargement configurations', err)
    });

    // Partenaires
    this.partnerService.getPartners().subscribe({
      next: (res) => {
        const partners: Partner[] = res.Data || [];
        this.totalPartners = partners.length;
        this.activePartners = partners.filter(p => p.isActive).length;

        const totalPrices = partners.reduce((sum, p) => sum + (p.priceCount || 0), 0);
        this.averagePricesPerPartner = partners.length > 0 ? totalPrices / partners.length : 0;
      },
      error: (err) => console.error('Erreur chargement partenaires', err)
    });

    // Catégories
    this.categoryService.getCategories().subscribe({
      next: (res) => this.categories = res.Data || [],
      error: (err) => console.error('Erreur chargement catégories', err),
      complete: () => this.isLoading = false
    });
  }
}
