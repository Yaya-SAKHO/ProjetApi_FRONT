import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InitialsPipe } from '../../../../shared/pipes/initials.pipe';
import { Configuration } from '../../../../core/models/configuration/configuration.model';
import { User } from '../../../../core/models/user/user-profil.model';
import { UsersService } from '../../../../core/services/utilisateurs/utilisateurs';
import { ApiResponse } from '../../../../core/api/ApiResponse';
import { ConfigurationsService } from '../../../../core/services/configurations/configurations';


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
  isLoading = true;
  activeTab = 'configurations';

  constructor(
    private route: ActivatedRoute,
    private usersService: UsersService,
    private configurationsService: ConfigurationsService
  ) {}

  ngOnInit(): void {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.loadUser(userId);
      this.loadUserConfigurations(userId);
    }
  }

  loadUser(userId: string): void {
    this.usersService.getUser(userId).subscribe({
      next: (response: ApiResponse<User>) => {
        if (response.Success && response.Data) {
          this.user = response.Data;
        }
      },
      error: (error: any) => console.error('Erreur:', error)
    });
  }

  loadUserConfigurations(userId: string): void {
    this.configurationsService.getUserConfigurations(userId).subscribe({
      next: (response: ApiResponse<Configuration[]>) => {
        if (response.Success && response.Data) {
          this.configurations = response.Data;
        }
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Erreur:', error);
        this.isLoading = false;
      }
    });
  }

  promoteToAdmin(user: User): void {
    if (confirm(`Promouvoir ${user.name} en administrateur?`)) {
      this.usersService.promoteToAdmin(user.id).subscribe({
        next: () => {
          if (this.user) this.user.role = 'admin';
        },
        error: (error: any) => console.error('Erreur:', error)
      });
    }
  }

  toggleUserStatus(user: User): void {
    const action = user.isActive 
      ? this.usersService.banUser(user.id)
      : this.usersService.activateUser(user.id);

    action.subscribe({
      next: () => {
        if (this.user) this.user.isActive = !this.user.isActive;
      },
      error: (error: any) => console.error('Erreur:', error)
    });
  }

  changeTab(tab: string): void {
    this.activeTab = tab;
  }
}