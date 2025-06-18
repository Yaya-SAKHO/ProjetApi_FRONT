import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GenericStorageService {
  /**
   * Enregistre une valeur générique.
   */
  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Erreur lors de l’enregistrement de la donnée :', error);
      throw error;
    }
  }

  /**
   * Récupère une valeur générique.
   */
  get<T>(key: string): T | null {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Erreur lors de la récupération de la donnée :', error);
      throw error;
    }
  }

  /**
   * Supprime une valeur.
   */
  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Erreur lors de la suppression de la donnée :', error);
      throw error;
    }
  }

  /**
   * Vide tout le localStorage.
   */
  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Erreur lors du nettoyage du stockage :', error);
      throw error;
    }
  }
}
