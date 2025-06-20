import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';;
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { ComponentService } from '../../../service/component';
import { forkJoin } from 'rxjs';
import { CategoryService } from '../../../service/category';
import { IComponent } from '../../../core/models/user/component';

@Component({
  selector: 'app-pc-builder',
  imports: [ 
    CommonModule,
    FormsModule,
    MatSelectModule,
    MatCardModule,
    MatButtonModule],
  templateUrl: './pc-builder.html',
  styleUrl: './pc-builder.css'
})
export class PcBuilder {
  categories: string[] = [];
  components: IComponent[] = [];
  selectedComponents: { [category: string]: IComponent | null } = {};
  isLoading = true;
  objectKeys = Object.keys;
  constructor(
    private componentService: ComponentService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (categories) => {
        console.log("ekjeef",categories)
        this.categories = categories.map(c => c.name);
        this.loadAllComponents();
      },
      error: (err) => {
        console.error('Error loading categories', err);
        this.isLoading = false;
      }
    });
  }

  loadAllComponents(): void {
    const requests = this.categories.map(category => 
      this.componentService.getComponentsByCategory(category)
    );
    console.log("on a====================== UOI / ",this.components)
    forkJoin(requests).subscribe({
      next: (results) => {
        this.components = results.flat();
        
  
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading components', err);
        this.isLoading = false;
      }
    });
  }
  asComponent(value: any): IComponent {
    return value as IComponent;
  }
  
  getComponentsByCategory(category: string): IComponent[] {
    return this.components.filter(c => c.category === category);
  }
  
  private isIComponent(comp: any): comp is IComponent {
    return comp && 
           typeof comp.price === 'number' && 
           typeof comp.brand === 'string';
  }
  
  getTotal(): number {
    return Object.values(this.selectedComponents)
      .filter(this.isIComponent)
      .reduce((sum, comp) => sum + comp?.price!, 0);
  }
  
  saveConfiguration(): void {
    console.log('Configuration sauvegardée :', this.selectedComponents);
  }
}