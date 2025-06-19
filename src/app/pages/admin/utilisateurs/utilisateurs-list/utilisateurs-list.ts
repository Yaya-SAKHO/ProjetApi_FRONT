import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { User } from '../../../../core/models/user/user-profil.model';
import { UsersService } from '../../../../core/services/utilisateurs/utilisateurs';
import { InitialsPipe } from '../../../../shared/pipes/initials.pipe';
import { finalize } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-utilisateurs-list',
  standalone: true,
  imports: [CommonModule, RouterModule, InitialsPipe, FormsModule],
  templateUrl: './utilisateurs-list.html',
  styleUrls: ['./utilisateurs-list.css']
})
export class UtilisateursList implements OnInit {
  users: User[] = [];
  isLoading = true;
  searchTerm = '';
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.usersService.getUsers()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (response) => {
          if (response.Success && response.Data) {
            this.users = response.Data;
            this.totalItems = this.users.length;
          }
        },
        error: (error) => console.error('Erreur:', error)
      });
  }

  toggleUserStatus(user: User): void {
    const action = user.isActive 
      ? this.usersService.banUser(user.id)
      : this.usersService.activateUser(user.id);

    action.subscribe({
      next: () => {
        user.isActive = !user.isActive;
      },
      error: (error) => console.error('Erreur:', error)
    });
  }

  promoteToAdmin(user: User): void {
    if (confirm(`Promouvoir ${user.name} en administrateur?`)) {
      this.usersService.promoteToAdmin(user.id).subscribe({
        next: () => {
          user.role = 'admin';
        },
        error: (error) => console.error('Erreur:', error)
      });
    }
  }

  get filteredUsers(): User[] {
    return this.users.filter(user =>
      user.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  get paginatedUsers(): User[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredUsers.slice(start, start + this.itemsPerPage);
  }

  getDisplayRange(): { start: number, end: number } {
    const start = (this.currentPage - 1) * this.itemsPerPage + 1;
    const end = Math.min(this.currentPage * this.itemsPerPage, this.filteredUsers.length);
    return { start, end };
  }
  
  getPageNumbers(): number[] {
    const pageCount = Math.ceil(this.filteredUsers.length / this.itemsPerPage);
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }
}