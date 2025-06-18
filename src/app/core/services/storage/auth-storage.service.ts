import { Injectable } from '@angular/core';
import { STORAGE_KEYS } from '../../constants/storage-keys.constants';
import { Observable, of } from 'rxjs';

interface AuthData {
  token: string;
  roleActif: string;
  roles: string[];
}

@Injectable({ providedIn: 'root' })
export class AuthStorageService {
  saveAuthData(token: string, roleActif: string, roles: string[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify({ token, roleActif, roles }));
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement des données d\'authentification :', error);
      throw error;
    }
  }

  getAuthData(): AuthData | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AUTH);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Erreur lors de la récupération des données d\'authentification :', error);
      this.clearAuthData();
      return null;
    }
  }

  clearAuthData(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.AUTH);
    } catch (error) {
      console.error('Erreur lors de la suppression des données d\'authentification :', error);
    }
  }

  // Nouvelle méthode pour faciliter l'intégration avec les Observables
  getAuthDataObservable(): Observable<AuthData | null> {
    return of(this.getAuthData());
  }
}