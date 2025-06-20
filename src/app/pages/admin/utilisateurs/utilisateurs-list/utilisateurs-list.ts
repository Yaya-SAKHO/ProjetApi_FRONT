import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import { InitialsPipe } from '../../../../shared/pipes/initials.pipe';
import { User } from '../../../../core/models/admin/user/user.model';
import { UserService } from '../../../../core/services/admin/utilisateurs/utilisateurs';
import { ApiResponse } from '../../../../core/api/ApiResponse';

@Component({
  selector: 'app-utilisateurs-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, InitialsPipe],
  templateUrl: './utilisateurs-list.html',
  styleUrls: ['./utilisateurs-list.css']
})
export class UtilisateursList implements OnInit {
  isLoading = true;
  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm = '';
  currentPage = 1;
  itemsPerPage = 10;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userService.getUsers().pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (response: ApiResponse<User[]>) => {
        this.users = response.Data || [];
        this.filteredUsers = [...this.users];
      },
      error: (err) => console.error('Erreur chargement utilisateurs', err)
    });
  }

  get paginatedUsers(): User[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredUsers.slice(start, start + this.itemsPerPage);
  }

  filterUsers(): void {
    if (!this.searchTerm) {
      this.filteredUsers = [...this.users];
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(user => 
      user.name.toLowerCase().includes(term) || 
      user.email.toLowerCase().includes(term)
    );
    this.currentPage = 1;
  }

  promoteToAdmin(user: User): void {
    this.userService.updateUserRole(user._id, 'admin').subscribe({
      next: () => {
        user.role = 'admin';
      },
      error: (err) => console.error('Erreur promotion admin', err)
    });
  }

  toggleUserStatus(user: User): void {
    const newStatus = !user.isActive;
    this.userService.toggleUserStatus(user._id, newStatus).subscribe({
      next: () => {
        user.isActive = newStatus;
      },
      error: (err) => console.error('Erreur changement statut', err)
    });
  }

  getDisplayRange(): { start: number, end: number } {
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(this.currentPage * this.itemsPerPage, this.filteredUsers.length);
    return { start, end };
  }

  getPageNumbers(): number[] {
    const totalPages = Math.ceil(this.filteredUsers.length / this.itemsPerPage);
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
}