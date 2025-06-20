import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InitialsPipe } from '../../../../shared/pipes/initials.pipe';
import { finalize } from 'rxjs';
import { Configuration } from '../../../../core/models/configuration/configuration.model';
import { User } from '../../../../core/models/admin/user/user.model';
import { ConfigurationService } from '../../../../core/services/configurations/configuration.service';
import { UserService } from '../../../../core/services/utilisateurs/utilisateurs';
import { ApiResponse } from '../../../../core/api/ApiResponse';

@Component({
  selector: 'app-utilisateur-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, InitialsPipe],
  templateUrl: './utilisateur-detail.html',
  styleUrls: ['./utilisateur-detail.css']
})
export class UtilisateurDetail implements OnInit {
  user: User | null = null;
  configurations: Configuration[] = [];
  activeTab = 'configurations';
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private configService: ConfigurationService
  ) {}

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    console.log('User ID from route:', userId);
    if (userId) {
      this.loadUser(userId);
    }
  }

  loadUser(userId: string): void {
    this.userService.getUserById(userId).subscribe({
      next: (response: ApiResponse<User>) => {
        this.user = response.Data || null;
        if (this.user?.email) {
          this.loadUserConfigurations(this.user.email);
        }
      },
      error: (err) => console.error('Erreur chargement utilisateur', err)
    });
  }

  loadUserConfigurations(email: string): void {
    this.isLoading = true;
    this.configService.getConfigurationsByUser(email).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (response: ApiResponse<Configuration[]>) => {
        this.configurations = response.Data || [];
      },
      error: (err) => console.error('Erreur chargement configurations', err)
    });
  }

  changeTab(tab: string): void {
    this.activeTab = tab;
  }

  promoteToAdmin(user: User): void {
    this.userService.updateUserRole(user._id, 'admin').subscribe({
      next: () => {
        if (this.user) this.user.role = 'admin';
      },
      error: (err) => console.error('Erreur promotion admin', err)
    });
  }

  toggleUserStatus(user: User): void {
    const newStatus = !user.isActive;
    this.userService.toggleUserStatus(user._id, newStatus).subscribe({
      next: () => {
        if (this.user) this.user.isActive = newStatus;
      },
      error: (err) => console.error('Erreur changement statut', err)
    });
  }
}