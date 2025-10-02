import { Injectable, computed, signal } from '@angular/core';
import { Router } from '@angular/router';

export interface User {
  username: string;
  role: 'admin' | 'user';
}

export interface LoginCredentials {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly currentUser = signal<User | null>(null);
  private readonly isLoading = signal(false);

  // Computed signals
  readonly user = this.currentUser.asReadonly();
  readonly isAuthenticated = computed(() => this.currentUser() !== null);
  readonly isAdmin = computed(() => this.currentUser()?.role === 'admin');
  readonly loading = this.isLoading.asReadonly();

  // Mock user database - in real app this would come from API
  private readonly mockUsers = {
    'user': { username: 'user', password: '12345', role: 'user' as const },
    'admin': { username: 'admin', password: '12345', role: 'admin' as const }
  };

  constructor(private router: Router) {
    // Check if user is already logged in (localStorage persistence)
    this.initializeFromStorage();
  }

  async login(credentials: LoginCredentials): Promise<{ success: boolean; error?: string }> {
    this.isLoading.set(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const user = this.mockUsers[credentials.username as keyof typeof this.mockUsers];
      
      if (user && user.password === credentials.password) {
        const authUser: User = {
          username: user.username,
          role: user.role
        };
        
        this.currentUser.set(authUser);
        this.saveToStorage(authUser);
        
        // Navigate based on role
        if (user.role === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/']);
        }
        
        return { success: true };
      } else {
        return { success: false, error: 'Geçersiz kullanıcı adı veya şifre' };
      }
    } catch (error) {
      return { success: false, error: 'Giriş sırasında bir hata oluştu' };
    } finally {
      this.isLoading.set(false);
    }
  }

  logout(): void {
    this.currentUser.set(null);
    this.clearStorage();
    this.router.navigate(['/login']);
  }

  private initializeFromStorage(): void {
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      try {
        const user = JSON.parse(stored);
        this.currentUser.set(user);
      } catch {
        this.clearStorage();
      }
    }
  }

  private saveToStorage(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  private clearStorage(): void {
    localStorage.removeItem('currentUser');
  }
}