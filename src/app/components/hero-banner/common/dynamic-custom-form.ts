/* 
Kullanıcı formu: 
İsim, Soyisim, Şehir, Ülke, E-posta, Telefon Numarası alanları kesinlikle olacak.
Yetenekler: Dinamik olarak eklenebilen yetenek alanları
Form doğrulama: Gerekli alanlar, e-posta formatı, telefon numarası formatı
Stil: Tailwind CSS ile modern ve kullanıcı dostu tasarım  
*/

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserInfoTableComponent } from './user-info-table';

@Component({
  standalone: true,
  selector: 'app-skills-form-custom',
  imports: [ReactiveFormsModule, CommonModule, UserInfoTableComponent],
  template: `
    <div class="p-4 max-w-md mx-auto bg-white rounded-lg shadow-sm border">
      <div [formGroup]="userInfo" class="space-y-4">
        
        <!-- Kişisel Bilgiler Grubu -->
        <div class="space-y-3">
          <h3 class="text-sm font-semibold text-gray-700 border-b pb-1">Kişisel Bilgiler</h3>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <input formControlName="firstName" placeholder="İsim" 
                     class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     [class.border-red-500]="userInfo.get('firstName')?.invalid && userInfo.get('firstName')?.touched" />
              <div *ngIf="userInfo.get('firstName')?.invalid && userInfo.get('firstName')?.touched" 
                   class="text-xs text-red-600 mt-1">İsim gerekli</div>
            </div>
            <div>
              <input formControlName="lastName" placeholder="Soyisim" 
                     class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     [class.border-red-500]="userInfo.get('lastName')?.invalid && userInfo.get('lastName')?.touched" />
              <div *ngIf="userInfo.get('lastName')?.invalid && userInfo.get('lastName')?.touched" 
                   class="text-xs text-red-600 mt-1">Soyisim gerekli</div>
            </div>
          </div>
        </div>

        <!-- Adres Bilgileri Grubu -->
        <div class="space-y-3">
          <h3 class="text-sm font-semibold text-gray-700 border-b pb-1">Adres Bilgileri</h3>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <input formControlName="city" placeholder="Şehir" 
                     class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     [class.border-red-500]="userInfo.get('city')?.invalid && userInfo.get('city')?.touched" />
              <div *ngIf="userInfo.get('city')?.invalid && userInfo.get('city')?.touched" 
                   class="text-xs text-red-600 mt-1">Şehir gerekli</div>
            </div>
            <div>
              <input formControlName="country" placeholder="Ülke" 
                     class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                     [class.border-red-500]="userInfo.get('country')?.invalid && userInfo.get('country')?.touched" />
              <div *ngIf="userInfo.get('country')?.invalid && userInfo.get('country')?.touched" 
                   class="text-xs text-red-600 mt-1">Ülke gerekli</div>
            </div>
          </div>
        </div>

        <!-- İletişim Bilgileri Grubu -->
        <div class="space-y-3">
          <h3 class="text-sm font-semibold text-gray-700 border-b pb-1">İletişim Bilgileri</h3>
          <div>
            <input formControlName="email" placeholder="E-posta" type="email"
                   class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                   [class.border-red-500]="userInfo.get('email')?.invalid && userInfo.get('email')?.touched" />
            <div *ngIf="userInfo.get('email')?.invalid && userInfo.get('email')?.touched" 
                 class="text-xs text-red-600 mt-1">
              <span *ngIf="userInfo.get('email')?.errors?.['required']">E-posta gerekli</span>
              <span *ngIf="userInfo.get('email')?.errors?.['email']">Geçerli bir e-posta adresi giriniz</span>
            </div>
          </div>
          <div>
            <input formControlName="phone" placeholder="Telefon Numarası" 
                   class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                   [class.border-red-500]="userInfo.get('phone')?.invalid && userInfo.get('phone')?.touched" />
            <div *ngIf="userInfo.get('phone')?.invalid && userInfo.get('phone')?.touched" 
                 class="text-xs text-red-600 mt-1">
              <span *ngIf="userInfo.get('phone')?.errors?.['required']">Telefon numarası gerekli</span>
              <span *ngIf="userInfo.get('phone')?.errors?.['pattern']">Geçerli bir telefon numarası giriniz</span>
            </div>
          </div>
        </div>

        <!-- Yetenekler Grubu -->
        <div class="space-y-3">
          <h3 class="text-sm font-semibold text-gray-700 border-b pb-1">Yetenekler</h3>
          <div formArrayName="skills" class="space-y-2">
            <div *ngFor="let s of skills.controls; let i = index" 
                 class="flex items-center gap-2">
              <input 
                [formControlName]="i"
                placeholder="Yetenek giriniz"
                class="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <button 
                *ngIf="skills.length > 1"
                (click)="removeSkill(i)"
                type="button"
                class="px-2 py-2 text-xs text-red-600 hover:bg-red-50 rounded-md transition-colors">
                ✕
              </button>
            </div>
          </div>
          <button 
            (click)="addSkill()"
            type="button"
            class="w-full px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
            Yetenek Ekle
          </button>
        </div>
      </div>

      <!-- Tablo Görünümü -->
      <app-user-info-table [userInfo]="userInfo.value"></app-user-info-table>
    </div>
  `
})
export class UserFormComponentWithSkills {
  userInfo = new FormGroup({
    firstName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    lastName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    city: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    country: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    phone: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.pattern(/^[0-9\-\+]{9,15}$/)] }),
    skills: new FormArray<FormControl<string>>([
      new FormControl('', { nonNullable: true, validators: [Validators.required] })
    ])
  });

  get skills() {
    return this.userInfo.controls.skills;
  }

  addSkill() {
    this.skills.push(new FormControl('', { nonNullable: true }));
  }

  removeSkill(index: number) {
    if (this.skills.length > 1) {
      this.skills.removeAt(index);
    }
  }

  // yetenek eklendiğinde form'daki değerleri console'a yazma
  constructor() {
    this.userInfo.valueChanges.subscribe(value => {
      console.log('Güncel Form Değeri:', value);
    });
  }
}