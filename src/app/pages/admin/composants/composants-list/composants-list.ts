import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { Component as PcComponent } from '../../../../core/models/component/component.model';
import { ComponentService } from '../../../../core/services/composants/composants.service';
import { CategoryService } from '../../../../core/services/category/category.service';
import { ApiResponse } from '../../../../core/api/ApiResponse';
import { Category } from '../../../../core/models/category/category.model';

@Component({
  selector: 'app-composants-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './composants-list.html',
  styleUrls: ['./composants-list.css']
})
export class ComposantsList implements OnInit {
  isLoading = true;
  components: PcComponent[] = [];
  filteredComponents: PcComponent[] = [];
  categories: Category[] = [];
  searchTerm = '';
  currentPage = 1;
  itemsPerPage = 10;
  imageUrls: { [componentId: string]: string } = {};

  // Filtres
  filters = {
    category: '',
    minPrice: null as number | null,
    maxPrice: null as number | null,
    brand: ''
  };

  constructor(
    private componentService: ComponentService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadComponents();
    this.loadCategories();
  }

  loadComponents(): void {
    this.isLoading = true;
    this.componentService.getAllComponents().pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (response: ApiResponse<PcComponent[]>) => {
        this.components = response.Data || [];
        
        this.filteredComponents = [...this.components];
  
        console.log(this.components)
        // Génération des URLs base64
        for (const comp of this.components) {
          if (comp.image?.data && Array.isArray((comp.image.data as any).data)) {
            const byteArray = new Uint8Array((comp.image.data as any).data);
            const base64String = btoa(String.fromCharCode(...byteArray));
            this.imageUrls[comp._id] = `data:${comp.image.contentType};base64,${base64String}`;
          }
        }
      },
      error: (err) => console.error('Erreur chargement composants', err)
    });
  }
  

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (response: ApiResponse<Category[]>) => {
        this.categories = response.Data || [];
      },
      error: (err) => console.error('Erreur chargement catégories', err)
    });
  }

  filterComponents(): void {
    let result = [...this.components];

    // Filtre par recherche texte
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(comp => 
        comp.name.toLowerCase().includes(term) || 
        comp.brand.toLowerCase().includes(term)
      );
    }

    // Filtre par catégorie
    if (this.filters.category) {
      result = result.filter(comp => 
        typeof comp.category === 'string' 
          ? comp.category === this.filters.category
          : comp.category._id === this.filters.category
      );
    }

    // Filtre par marque
    if (this.filters.brand) {
      result = result.filter(comp => 
        comp.brand.toLowerCase().includes(this.filters.brand.toLowerCase())
      );
    }

    this.filteredComponents = result;
    this.currentPage = 1;
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.filters = {
      category: '',
      minPrice: null,
      maxPrice: null,
      brand: ''
    };
    this.filteredComponents = [...this.components];
  }

  get paginatedComponents(): PcComponent[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredComponents.slice(start, start + this.itemsPerPage);
  }

  getDisplayRange(): { start: number, end: number } {
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(this.currentPage * this.itemsPerPage, this.filteredComponents.length);
    return { start, end };
  }

  getPageNumbers(): number[] {
    const totalPages = Math.ceil(this.filteredComponents.length / this.itemsPerPage);
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  deleteComponent(id: string): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce composant ?')) {
      this.componentService.deleteComponent(id).subscribe({
        next: () => {
          this.components = this.components.filter(c => c._id !== id);
          this.filteredComponents = this.filteredComponents.filter(c => c._id !== id);
        },
        error: (err) => console.error('Erreur suppression composant', err)
      });
    }
  }

  getCategoryName(component: PcComponent): string {
    if (typeof component.category === 'string') {
      if (this.categories.some(cat => cat.name === component.category)) {
        return component.category;
      }
      const cat = this.categories.find(c => c._id === component.category);
      return cat ? cat.name : 'Inconnue';
    }
    return component.category.name;
  }
}