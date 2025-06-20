import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';;
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { forkJoin } from 'rxjs';
import { ComponentService } from '../../../core/services/composants/composants.service';
import { CategoryService } from '../../../core/services/category/category.service';
import { Category } from '../../../core/models/category/category.model';
import { IComponent } from '../../../core/models/component/component.model';
import { ApiResponse } from '../../../core/api/ApiResponse';
import { MatListModule } from '@angular/material/list'
import { MatIconModule } from '@angular/material/icon'


@Component({
  selector: 'app-pc-builder',
  imports: [ 
    CommonModule,
    FormsModule,
    MatSelectModule,
    MatCardModule,
    MatButtonModule,
    MatListModule,
    MatIconModule
  ],
  templateUrl: './pc-builder.html',
  styleUrl: './pc-builder.css'
})
export class PcBuilder {
  categories: Category[] = [];
  components: IComponent[] = [];
  selectedComponents: { [categoryName: string]: IComponent | null } = {};
  isLoading = true;
  @ViewChild('summarySection') summarySection!: ElementRef;
  constructor(
    private componentService: ComponentService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (response: ApiResponse<Category[]>) => {
        if (response.Success && response.Data) {
          this.categories = response.Data;
          this.loadAllComponents();
        } else {
          console.error('Failed to load categories', response.Status);
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('Error loading categories', err);
        this.isLoading = false;
      }
    });
  }

  loadAllComponents(): void {
    console.log('Loading components for all categories...');
    const requests$ = this.categories.map(cat => 
      this.componentService.getComponentsByCategory(cat.name)
    );

    forkJoin(requests$).subscribe({
      next: (responses: ApiResponse<IComponent[]>[]) => {
        console.log('Responses received:', responses);
        this.components = responses
          .filter(res => res.Success && res.Data)
          .flatMap(res => res.Data || [])        
          .map(comp => {
            let categoryId: string;
            if (typeof comp.category === 'string') {
              categoryId = comp.category;
            } else {
              categoryId = (comp.category as any)?._id || comp.category;
            }
        
            const category = this.categories.find(c => c.name === comp.category || c._id === categoryId);
            return {
              ...comp,
              category: category?._id || categoryId
            };
          });

        console.log('Composants normalisés:', this.components);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des composants', err);
        this.isLoading = false;
      }
    });
  }

  getComponentsByCategory(categoryName: string): IComponent[] {
    const category = this.categories.find(c => c.name === categoryName);
    if (!category) {
      console.warn(`Catégorie non trouvée: ${categoryName}`);
      return [];
    }
    const categoryId = category._id;
    return this.components.filter(c => {
      return String(c.category) === String(categoryId);
    });
  }

  getCurrentPrice(component: IComponent): number {
    if (!component?.prices || !Array.isArray(component.prices) || component.prices.length === 0) {
      return 0;
    }
    
    // Trier par date décroissante et prendre le prix le plus récent
    const sortedPrices = [...component.prices].sort((a, b) => {
      const dateA = new Date();
      const dateB = new Date();
      return dateB.getTime() - dateA.getTime();
    });
    
    return sortedPrices[0]?.price || 0;
  }

  getTotal(): number {
    return Object.values(this.selectedComponents)
      .filter(comp => comp !== null)
      .reduce((sum, comp) => sum + this.getCurrentPrice(comp!), 0);
  }

  saveConfiguration(): void {
    const configToSave = Object.entries(this.selectedComponents)
      .filter(([_, comp]) => comp !== null)
      .map(([category, comp]) => ({
        category,
        componentId: comp!._id
      }));

    console.log('Configuration à sauvegarder:', configToSave);
    // Ici vous pourriez appeler un service pour sauvegarder
  }

  objectKeys = Object.keys;

  trackByComponentId(index: number, comp: IComponent): string {
    return comp._id;
  }
}