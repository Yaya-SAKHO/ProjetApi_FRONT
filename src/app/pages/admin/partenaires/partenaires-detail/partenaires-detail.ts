import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PartnerService } from '../../../../core/services/partenaires/partner.service';
import { Partner } from '../../../../core/models/partner/partner.model';
import { ApiResponse } from '../../../../core/api/ApiResponse';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InitialsPipe } from '../../../../shared/pipes/initials.pipe';
import { FormsModule } from '@angular/forms';
import { TruncatePipe } from '../../../../shared/pipes/truncate.pipe';

@Component({
  selector: 'app-partenaires-detail',
  standalone: true,
  imports: [ CommonModule, 
    RouterModule, 
    FormsModule, 
    InitialsPipe,
    DatePipe],
  templateUrl: './partenaires-detail.html',
  styleUrls: ['./partenaires-detail.css']
})
export class PartenairesDetail implements OnInit {
  partner: Partner | null = null;
  isLoading = true;
  error: string | null = null;
  imageUrl: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private partnerService: PartnerService
  ) {}

  ngOnInit(): void {
    const partnerId = this.route.snapshot.paramMap.get('id');
    if (partnerId) {
      this.loadPartner(partnerId);
    } else {
      this.error = 'ID partenaire non trouvé';
      this.isLoading = false;
    }
  }


    loadPartner(partnerId: string): void {
    if (!partnerId) {
        this.error = 'ID partenaire invalide';
        this.isLoading = false;
        return;
    }

    this.isLoading = true;
    this.partnerService.getPartnerWithDetails(partnerId).subscribe({
        next: (response: ApiResponse<Partner>) => {
        if (!response.Data) {
            this.error = 'Partenaire non trouvé';
            this.isLoading = false;
            return;
        }
        this.partner = {
        ...response.Data,
        id: (response.Data as any).id || (response.Data as any)._id 
        };

        if (this.partner.image?.data && Array.isArray((this.partner.image.data as any).data)) {
            const byteArray = new Uint8Array((this.partner.image.data as any).data);
            const base64String = btoa(String.fromCharCode(...byteArray));
            this.imageUrl = `data:${this.partner.image.contentType};base64,${base64String}`;
            }

        console.log("detail", this.partner)
        this.isLoading = false;
        },
        error: (err) => {
        console.error('Error loading partner:', err);
        this.error = 'Erreur lors du chargement du partenaire';
        this.isLoading = false;
        }
    });
    }

  deletePartner(): void {
    if (this.partner && confirm('Êtes-vous sûr de vouloir supprimer ce partenaire ?')) {
      this.partnerService.deletePartner(this.partner.id).subscribe({
        next: () => {
          this.router.navigate(['/admin/partenaires']);
        },
        error: (err) => {
          console.error('Erreur suppression partenaire', err);
          this.error = 'Erreur lors de la suppression';
        }
      });
    }
  }
}