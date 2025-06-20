// partenaires-form.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { finalize } from 'rxjs';
import { Partner } from '../../../../core/models/partner/partner.model';
import { PartnerFormData } from '../../../../core/models/partner/partner-form-data.model';
import { ApiResponse } from '../../../../core/api/ApiResponse';
import { PartnerService } from '../../../../core/services/partenaires/partner.service';

@Component({
  selector: 'app-partenaires-form',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './partenaires-form.html',
  styleUrls: ['./partenaires-form.scss']
})
export class PartenairesForm implements OnInit {
  isEditMode = false;
  isLoading = false;
  isSubmitting = false;
  partner: Partner = {
    id: '',
    name: '',
    website: '',
    description: '',
    isActive: true
  };
  imageFile: File | null = null;
  previewImage: string | ArrayBuffer | null = null;
  isDragging = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private partnerService: PartnerService
  ) {}

  ngOnInit(): void {
    const partnerId = this.route.snapshot.paramMap.get('id');
    if (partnerId && this.router.url.includes('/modifier'))  {
      this.isEditMode = true;
      this.loadPartner(partnerId);
    }
  }

  loadPartner(partnerId: string): void {
    this.isLoading = true;
    this.partnerService.getPartnerWithDetails(partnerId).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (response: ApiResponse<Partner>) => {
        this.partner = {
          ...(response.Data as any),
          id: (response.Data as any).id || (response.Data as any)._id
        };
        if (
          this.partner.image &&
          this.partner.image.data &&
          Array.isArray((this.partner.image.data as any).data)
        ) {
          const byteArray = new Uint8Array((this.partner.image.data as any).data);
          const base64String = btoa(String.fromCharCode(...byteArray));
          this.previewImage = `data:${this.partner.image.contentType};base64,${base64String}`;
        }
      },
      error: (err) => console.error('Erreur chargement partenaire', err)
    });
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
    
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      this.handleFileSelection(event.dataTransfer.files[0]);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.handleFileSelection(input.files[0]);
    }
  }

  private handleFileSelection(file: File): void {
    if (!file.type.match('image.*')) {
      alert('Seules les images sont acceptées');
      return;
    }

    this.imageFile = file;
    
    const reader = new FileReader();
    reader.onload = () => {
      this.previewImage = reader.result;
    };
    reader.readAsDataURL(this.imageFile);
  }

  removeImage(): void {
    this.imageFile = null;
    this.previewImage = null;
    if (this.isEditMode && this.partner.image) {
      this.partner.image = undefined;
    }
  }

  onSubmit(): void {
    if (!this.partner.name) {
      alert('Le nom du partenaire est obligatoire');
      return;
    }

    this.isSubmitting = true;
    
    const formData: PartnerFormData = {
      name: this.partner.name,
      website: this.partner.website,
      description: this.partner.description,
      isActive: this.partner.isActive,
      imageFile: this.imageFile || undefined
    };

    const operation = this.isEditMode 
      ? this.partnerService.updatePartner(this.partner.id, formData)
      : this.partnerService.addPartner(formData);

    operation.pipe(
      finalize(() => this.isSubmitting = false)
    ).subscribe({
      next: () => {
        this.router.navigate(['/admin/partenaires']);
      },
      error: (err) => {
        console.error('Erreur sauvegarde partenaire', err);
        alert('Une erreur est survenue lors de la sauvegarde');
      }
    });
  }
}