import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter, map, take } from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.html',
  styleUrls: ['./admin-layout.scss'],
  standalone: true,
  imports: [RouterModule, CommonModule]
})
export class AdminLayout {
  currentRouteTitle = 'Dashboard';
  userName = 'Chargement...';
  userInitials = '?';
  dropdownOpen = false;

  private routeTitles: {[key: string]: string} = {
    'dashboard': 'Tableau de bord',
    'composants': 'Gestion des composants',
    'composants/nouveau': 'Nouveau composant',
    'utilisateurs': 'Gestion des utilisateurs',
    'configurations': 'Configurations PC',
    'partenaires': 'Partenaires marchands'
  };

  constructor(private router: Router, private authService: AuthService) {
    this.loadUserData();
    this.setupRouteTracking();
  }

  private loadUserData(): void {
    this.authService.currentUser$
      .pipe(take(1))
      .subscribe({
        next: (user) => {
          if (user) {
            this.userName = user.name || user.email || 'Admin';
            this.userInitials = this.generateInitials(this.userName);
            console.log("Utilisateur chargé:", this.userName);
          } else {
            console.warn("Aucun utilisateur connecté");
            this.router.navigate(['/auth/login']);
          }
        },
        error: (err) => {
          console.error("Erreur chargement utilisateur:", err);
          this.userName = 'Erreur';
          this.userInitials = '!';
        }
      });
  }

  private generateInitials(name: string): string {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  private setupRouteTracking(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        let route = this.router.routerState.root.firstChild;
        while (route?.firstChild) {
          route = route.firstChild;
        }
        return route?.snapshot.url.map(segment => segment.path).join('/') || 'dashboard';
      })
    ).subscribe(routePath => {
      this.currentRouteTitle = this.routeTitles[routePath] || this.routeTitles['dashboard'];
    });
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}