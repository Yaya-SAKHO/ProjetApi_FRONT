import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ComponentService } from '../../../../core/services/composants/composants.service';
import { Component as PcComponent } from '../../../../core/models/component/component.model';
import { ApiResponse } from '../../../../core/api/ApiResponse';
import { InitialsPipe } from '../../../../shared/pipes/initials.pipe';

@Component({
  selector: 'app-composant-detail',
  standalone: true,
  imports: [CommonModule, InitialsPipe, RouterModule],
  templateUrl: './composant-detail.html',
  styleUrls: ['./composant-detail.css']
})
export class ComposantDetail implements OnInit {
  component: PcComponent | null = null;
  isLoading = true;
  error: string | null = null;
  imageUrl: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private componentService: ComponentService
  ) {}

  ngOnInit(): void {
    const componentId = this.route.snapshot.paramMap.get('id');
    if (componentId) {
      this.loadComponent(componentId);
    } else {
      this.error = 'ID composant non trouvé';
      this.isLoading = false;
    }
  }

  loadComponent(id: string): void {
    this.isLoading = true;
    this.componentService.getComponentDetails(id).subscribe({
      next: (response: ApiResponse<any>) => {
        if (!response.Data?.component) {
          this.error = 'Composant non trouvé';
          this.isLoading = false;
          return;
        }
        
        this.component = {
          ...response.Data.component,
          _id: response.Data.component._id || id
        };

        if (this.component?.image) {
          if (typeof this.component.image === 'string') {
            this.imageUrl = this.component.image;
          } else {
            this.imageUrl = `data:${this.component.image.contentType};base64,${this.component.image.data}`;
          }
        }

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading component:', err);
        this.error = 'Erreur lors du chargement';
        this.isLoading = false;
      }
    });
  }

  deleteComponent(): void {
    if (this.component && confirm('Êtes-vous sûr de vouloir supprimer ce composant ?')) {
      this.componentService.deleteComponent(this.component._id).subscribe({
        next: () => {
          this.router.navigate(['/admin/composants']);
        },
        error: (err) => {
          console.error('Erreur suppression composant', err);
          this.error = 'Erreur lors de la suppression';
        }
      });
    }
  }

  objectKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }
}