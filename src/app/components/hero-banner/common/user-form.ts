import { Component } from '@angular/core';
import { FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-user-form',
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    
    <div class="w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg border border-gray-200">
      <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">Kullanıcı Formu</h2>
      
      <div class="mb-4">
        <label class="block text-sm font-medium text-gray-700 mb-2">
          İsim
        </label>
        <input 
          [formControl]="name" 
          placeholder="İsminizi giriniz..."
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-400"
          [class.border-red-500]="name.invalid && name.touched"
          [class.focus:ring-red-500]="name.invalid && name.touched"
          [class.focus:border-red-500]="name.invalid && name.touched"
        >
        <div *ngIf="name.value && name.valid" class="mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
          <p class="text-sm text-green-700 font-medium">
            <span class="mr-1">✓</span>
            Merhaba, {{ name.value }}!
          </p>
        </div>
        <div *ngIf="name.invalid && name.touched" class="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
          <p class="text-sm text-red-600 font-medium">
            <span class="mr-1">⚠</span>
            İsim alanı zorunludur!
          </p>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class NameForm {
  name = new FormControl<string>('', { nonNullable: true, validators: [Validators.required] });
}