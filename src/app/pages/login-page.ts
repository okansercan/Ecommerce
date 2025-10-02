import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService, LoginCredentials } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule
  ],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 flex items-center justify-center p-4">
      <!-- Background Pattern -->
      <div class="absolute inset-0 bg-black/20"></div>      
      <div class="relative w-full max-w-md">
        <!-- Login Card -->
        <div class="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
          <!-- Header -->
          <div class="px-8 pt-8 pb-6 text-center">
            <!-- Logo -->
            <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg mb-4">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l-1 12H6L5 9z"></path>
              </svg>
            </div>
            
            <h1 class="text-2xl font-bold text-gray-900 mb-2">ShopZone Admin</h1>
            <p class="text-gray-600 text-sm">Hesabınıza giriş yapın</p>
          </div>

          <!-- Login Form -->
          <div class="px-8 pb-8">
            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
              <!-- Username Field -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Kullanıcı Adı
                </label>
                <div class="relative">
                  <input 
                    formControlName="username" 
                    type="text"
                    placeholder="Kullanıcı adınızı girin"
                    [disabled]="authService.loading()"
                    class="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    [class.border-red-500]="loginForm.get('username')?.invalid && loginForm.get('username')?.touched"
                    [class.focus:ring-red-500]="loginForm.get('username')?.invalid && loginForm.get('username')?.touched">
                  <div class="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                  </div>
                </div>
                <div *ngIf="loginForm.get('username')?.invalid && loginForm.get('username')?.touched" class="mt-2 text-red-500 text-sm">
                  Kullanıcı adı gereklidir
                </div>
              </div>

              <!-- Password Field -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Şifre
                </label>
                <div class="relative">
                  <input 
                    formControlName="password" 
                    [type]="hidePassword ? 'password' : 'text'"
                    placeholder="Şifrenizi girin"
                    [disabled]="authService.loading()"
                    class="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    [class.border-red-500]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
                    [class.focus:ring-red-500]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched">
                  <div class="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                  </div>
                  <button 
                    type="button"
                    (click)="hidePassword = !hidePassword"
                    class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                    <svg *ngIf="hidePassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                    <svg *ngIf="!hidePassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                    </svg>
                  </button>
                </div>
                <div *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched" class="mt-2 text-red-500 text-sm">
                  Şifre gereklidir
                </div>
              </div>

              <!-- Error Message -->
              <div *ngIf="errorMessage()" class="p-4 bg-red-50 border border-red-200 rounded-xl">
                <div class="flex items-center">
                  <svg class="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span class="text-red-700 text-sm">{{ errorMessage() }}</span>
                </div>
              </div>

              <!-- Login Button -->
              <button 
                type="submit" 
                [disabled]="!loginForm.valid || authService.loading()"
                class="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none flex items-center justify-center space-x-2">
                <div *ngIf="authService.loading()" class="flex items-center space-x-2">
                  <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Giriş yapılıyor...</span>
                </div>
                <div *ngIf="!authService.loading()" class="flex items-center space-x-2">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                  </svg>
                  <span>Giriş Yap</span>
                </div>
              </button>
            </form>
          </div>

          <!-- Test Accounts Info -->
          <div class="px-8 pb-8">
            <div class="border-t border-gray-200 pt-6">
              <h4 class="text-sm font-semibold text-gray-700 mb-3 text-center">Test Hesapları</h4>
              <div class="space-y-3">
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div class="flex items-center space-x-2">
                    <div class="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                    </div>
                    <div class="text-sm">
                      <span class="font-medium text-gray-700">Kullanıcı:</span>
                      <span class="text-gray-600"> user / 12345</span>
                    </div>
                  </div>
                </div>
                <div class="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <div class="flex items-center space-x-2">
                    <div class="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                      <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                    </div>
                    <div class="text-sm">
                      <span class="font-medium text-gray-700">Admin:</span>
                      <span class="text-gray-600"> admin / 12345</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="text-center mt-8">
          <p class="text-white/80 text-sm">
            © 2024 ShopZone. Tüm hakları saklıdır.
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .animate-spin {
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage = signal<string>('');
  hidePassword = true;

  constructor(
    public authService: AuthService,
    private fb: FormBuilder
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.valid) {
      this.errorMessage.set('');
      
      const credentials: LoginCredentials = {
        username: this.loginForm.value.username,
        password: this.loginForm.value.password
      };
      
      const result = await this.authService.login(credentials);
      
      if (!result.success && result.error) {
        this.errorMessage.set(result.error);
      }
    }
  }
}