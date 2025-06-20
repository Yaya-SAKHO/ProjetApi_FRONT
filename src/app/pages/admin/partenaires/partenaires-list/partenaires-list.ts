// partenaires-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { Partner } from '../../../../core/models/partner/partner.model';
import { ApiResponse } from '../../../../core/api/ApiResponse';
import { PartnerService } from '../../../../core/services/partenaires/partner.service';
import { TruncatePipe } from '../../../../shared/pipes/truncate.pipe';
import { InitialsPipe } from '../../../../shared/pipes/initials.pipe';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-partenaires-list',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    FormsModule, 
    TruncatePipe, 
    InitialsPipe,
    DatePipe
  ],
  templateUrl: './partenaires-list.html',
  styleUrls: ['./partenaires-list.css']
})
export class PartenairesList implements OnInit {
  isLoading = true;
  partners: Partner[] = [];
  filteredPartners: Partner[] = [];
  searchTerm = '';
  currentPage = 1;
  itemsPerPage = 10;

  constructor(private partnerService: PartnerService) {}

  ngOnInit(): void {
    this.loadPartners();
  }

 

  // In partenaires-list.component.ts
loadPartners(): void {
  this.isLoading = true;
  this.partnerService.getPartners().pipe(
    finalize(() => this.isLoading = false)
  ).subscribe({
    next: (response: ApiResponse<Partner[]>) => {
      this.partners = response.Data || [];
      this.filteredPartners = [...this.partners];
      console.log('Loaded partners:', this.partners); // Add this line
    },
    error: (err) => console.error('Erreur chargement partenaires', err)
  });
}

  get paginatedPartners(): Partner[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredPartners.slice(start, start + this.itemsPerPage);
  }

  get activePartnersCount(): number {
    return this.partners.filter(p => p.isActive === true).length;
  }

  filterPartners(): void {
    if (!this.searchTerm) {
      this.filteredPartners = [...this.partners];
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredPartners = this.partners.filter(partner => 
      partner.name.toLowerCase().includes(term) || 
      (partner.website && partner.website.toLowerCase().includes(term)) ||
      (partner.description && partner.description.toLowerCase().includes(term))
    );
    this.currentPage = 1;
  }

  togglePartnerStatus(partner: Partner): void {
    const newStatus = !partner.isActive;
    this.partnerService.togglePartnerStatus(partner.id).subscribe({
      next: () => {
        partner.isActive = newStatus;
      },
      error: (err) => {
        console.error('Erreur changement statut', err);
        partner.isActive = !newStatus; // Revert on error
      }
    });
  }

  getDisplayRange(): { start: number, end: number } {
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(this.currentPage * this.itemsPerPage, this.filteredPartners.length);
    return { start, end };
  }

  getPageNumbers(): number[] {
    const totalPages = Math.ceil(this.filteredPartners.length / this.itemsPerPage);
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
}