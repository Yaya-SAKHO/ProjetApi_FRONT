import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { Configuration } from '../../../../core/models/configuration/configuration.model';
import { ConfigurationService } from '../../../../core/services/configurations/configuration.service';
import { UserService } from '../../../../core/services/utilisateurs/utilisateurs';
import { ApiResponse } from '../../../../core/api/ApiResponse';
import { ConfigurationStats } from '../../../../core/models/configuration/configuration-stats.model';
import { UniquePipe } from '../../../../shared/pipes/unique.pipe';

@Component({
  selector: 'app-configurations-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, UniquePipe ],
  templateUrl: './configurations-list.html',
  styleUrls: ['./configurations-list.css']
})
export class ConfigurationsList implements OnInit {
  isLoading = true;
  configurations: Configuration[] = [];
  filteredConfigurations: Configuration[] = [];
  stats: ConfigurationStats | null = null;
  searchTerm = '';
  currentPage = 1;
  itemsPerPage = 10;

  // Filtres
  filters = {
    user: '',
    minPrice: null as number | null,
    maxPrice: null as number | null,
    dateFrom: null as Date | null,
    dateTo: null as Date | null
  };

  constructor(
    private configService: ConfigurationService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadConfigurations();
    this.loadStats();
  }

  loadConfigurations(): void {
    this.isLoading = true;
    this.configService.getConfigurationsWithUserDetails().pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (response: ApiResponse<Configuration[]>) => {
        this.configurations = response.Data || [];
        this.filteredConfigurations = [...this.configurations];
      },
      error: (err) => console.error('Erreur chargement configurations', err)
    });
  }

  loadStats(): void {
    this.configService.getConfigurationStats().subscribe({
      next: (response: ApiResponse<ConfigurationStats>) => {
        this.stats = response.Data || null;
      },
      error: (err) => console.error('Erreur chargement statistiques', err)
    });
  }

  filterConfigurations(): void {
    let result = [...this.configurations];

    // Filtre par recherche texte
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(config => 
        config.name.toLowerCase().includes(term) || 
        (typeof config.user !== 'string' && config.user.email.toLowerCase().includes(term))
      );
    }

    // Filtre par utilisateur
    if (this.filters.user) {
      result = result.filter(config => 
        typeof config.user !== 'string' && config.user._id === this.filters.user
      );
    }

    // Filtre par prix
    if (this.filters.minPrice) {
      result = result.filter(config => 
        config.totalCost && config.totalCost >= this.filters.minPrice!
      );
    }
    if (this.filters.maxPrice) {
      result = result.filter(config => 
        config.totalCost && config.totalCost <= this.filters.maxPrice!
      );
    }

    // Filtre par date
    if (this.filters.dateFrom) {
      result = result.filter(config => 
        new Date(config.createdAt) >= this.filters.dateFrom!
      );
    }
    if (this.filters.dateTo) {
      result = result.filter(config => 
        new Date(config.createdAt) <= this.filters.dateTo!
      );
    }

    this.filteredConfigurations = result;
    this.currentPage = 1;
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.filters = {
      user: '',
      minPrice: null,
      maxPrice: null,
      dateFrom: null,
      dateTo: null
    };
    this.filteredConfigurations = [...this.configurations];
  }

  get paginatedConfigurations(): Configuration[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredConfigurations.slice(start, start + this.itemsPerPage);
  }

  getDisplayRange(): { start: number, end: number } {
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(this.currentPage * this.itemsPerPage, this.filteredConfigurations.length);
    return { start, end };
  }

  getPageNumbers(): number[] {
    const totalPages = Math.ceil(this.filteredConfigurations.length / this.itemsPerPage);
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  deleteConfiguration(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette configuration ?')) {
      this.configService.deleteConfiguration(id).subscribe({
        next: () => {
          this.configurations = this.configurations.filter(c => c._id !== id);
          this.filteredConfigurations = this.filteredConfigurations.filter(c => c._id !== id);
        },
        error: (err) => console.error('Erreur suppression configuration', err)
      });
    }
  }
}