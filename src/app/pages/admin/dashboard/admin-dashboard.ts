import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserStats } from '../../../core/models/admin/user/user-stats.model';
import { ConfigurationStats } from '../../../core/models/configuration/configuration-stats.model';
import { PartnerStats } from '../../../core/models/partner/partner-stats.model';
import { Category } from '../../../core/models/category/category.model';
import { UserService } from '../../../core/services/utilisateurs/utilisateurs';
import { CategoryService } from '../../../core/services/category/category.service';
import { ConfigurationService } from '../../../core/services/configurations/configuration.service';
import { PartnerService } from '../../../core/services/partenaires/partner.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.scss']
})
export class AdminDashboard implements OnInit {
  userStats: UserStats | null = null;
  configStats: ConfigurationStats | null = null;
  partnerStats: PartnerStats | null = null;
  categories: Category[] = [];
  isLoading = true;

  constructor(
    private userService: UserService,
    private categoryService: CategoryService,
    private configurationService: ConfigurationService,
    private partnerService: PartnerService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    
    forkJoin([
      this.userService.getUserStats(),
      this.configurationService.getConfigurationStats(),
      this.partnerService.getPartnerStats(),
      this.categoryService.getCategories()
    ]).subscribe({
      next: ([userStats, configStats, partnerStats, categories]) => {
        this.userStats = userStats.Data || null;
        this.configStats = configStats.Data || null;
        this.partnerStats = partnerStats.Data || null;
        this.categories = categories.Data || [];
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading dashboard data', err);
        this.isLoading = false;
      }
    });
  }
}