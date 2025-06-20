// composants-form.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { finalize } from 'rxjs';
import { Component as PcComponent } from '../../../../core/models/component/component.model';
import { ComponentService } from '../../../../core/services/composants/composants.service';
import { CategoryService } from '../../../../core/services/category/category.service';
import { ApiResponse } from '../../../../core/api/ApiResponse';
import { Category } from '../../../../core/models/category/category.model';
import { ComponentFormData } from '../../../../core/models/component/component-form-data.model';

@Component({
  selector: 'app-composants-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './composants-form.html',
  styleUrls: ['./composants-form.css']
})
export class ComposantsForm implements OnInit {
  isEditMode = false;
  isLoading = false;
  isSubmitting = false;
  categories: Category[] = [];
  component: PcComponent = {
    _id: '',
    name: '',
    category: '',
    brand: '',
    specs: {},
    image: undefined
  };
  selectedFile: File | null = null;
  previewImage: string | ArrayBuffer | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private componentService: ComponentService,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    
    const componentId = this.route.snapshot.paramMap.get('id');
    if (componentId) {
      this.isEditMode = true;
      this.loadComponent(componentId);
    }
  }

  loadComponent(id: string): void {
    this.isLoading = true;
    console.log('Loading component with ID:', id);
    
    this.componentService.getComponentDetails(id).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (response: ApiResponse<any>) => { 
        
        if (!response.Data || !response.Data.component) {
          console.error('No component data in response');
          throw new Error('Composant non trouvé');
        }
  
        const apiData = response.Data.component;
        
        this.component = {
          _id: apiData._id || id,
          name: apiData.name || '',
          category: apiData.category?._id || apiData.category || '',
          brand: apiData.brand || '',
          specs: apiData.specs || {},
          image: typeof apiData.image === 'string' 
                 ? { data: apiData.image.split(',')[1], contentType: 'image/png' } 
                 : apiData.image
        };
  
        console.log('Component after processing:', this.component);
  

        if (this.component.image) {
          if (typeof this.component.image === 'string') {
            this.previewImage = this.component.image;
          } else {
            this.previewImage = `data:${this.component.image.contentType};base64,${this.component.image.data}`;
          }
        }
      },
      error: (err) => {
        console.error('Error loading component:', err);
        this.router.navigate(['/admin/composants']);
      }
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

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      
      // Afficher la prévisualisation
      const reader = new FileReader();
      reader.onload = () => {
        this.previewImage = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  private prepareComponentData(): ComponentFormData {

    const selectedCategory = this.categories.find(cat => 
      cat._id === this.component.category || 
      cat.name === this.component.category
    );
    
    return {
      name: this.component.name,
      category: selectedCategory ? selectedCategory.name : '',
      brand: this.component.brand,
      specs: this.component.specs,
      imageFile: this.selectedFile || undefined
    };
  }
  
  onSubmit(): void {
    this.isSubmitting = true;
    
    const componentData = this.prepareComponentData();
    console.log('Component data before submission:', componentData);

    const operation = this.isEditMode
      ? this.componentService.updateComponent(this.component._id!, componentData)
      : this.componentService.addComponent(componentData);

    operation.pipe(
      finalize(() => this.isSubmitting = false)
    ).subscribe({
      next: () => {
        this.router.navigate(['/admin/composants']);
      },
      error: (err) => console.error('Erreur sauvegarde composant', err)
    });
  }

  addSpecField(): void {
    if (!this.component.specs) {
      this.component.specs = {};
    }
    // Générer une clé unique
    const newKey = 'nouvelle_spec_' + Date.now();
    this.component.specs[newKey] = '';
  }

  updateSpecKey(oldKey: string, newKey: string): void {
    if (this.component.specs && this.component.specs[oldKey] !== undefined) {
      const value = this.component.specs[oldKey];
      delete this.component.specs[oldKey];
      this.component.specs[newKey] = value;
    }
  }

  removeSpecField(key: string): void {
    if (this.component.specs) {
      delete this.component.specs[key];
    }
  }

  trackByFn(index: number): number {
    return index;
  }

  objectKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }
}