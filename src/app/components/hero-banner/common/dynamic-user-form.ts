import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-skills-form',
  imports: [ReactiveFormsModule,CommonModule],
  template: `
    <div class="p-4 max-w-md mx-auto bg-white rounded-lg shadow-sm border">
      <div [formGroup]="skillsForm" class="space-y-3">
        <div formArrayName="skills" class="space-y-2">
          <div *ngFor="let s of skills.controls; let i = index" 
               class="flex items-center gap-2">
            <input 
              [formControlName]="i"
              placeholder="Yetenek giriniz"
              class="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          </div>
        </div>
        <button 
          (click)="addSkill()"
          type="button"
          class="w-full px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
          Yetenek Ekle
        </button>
      </div>

      <div class="mt-4 p-3 bg-gray-50 rounded-md">
        <pre class="text-xs text-gray-600 overflow-auto">{{ skillsForm.value | json }}</pre>
      </div>
    </div>
  `
})
export class SkillsFormComponent {
  skillsForm = new FormGroup({
    skills: new FormArray<FormControl<string>>([
      new FormControl('', { nonNullable: true, validators: [Validators.required] })
    ])
  });

  get skills() {
    return this.skillsForm.controls.skills;
  }

  addSkill() {
    this.skills.push(new FormControl('', { nonNullable: true }));
  }

  // yetenek eklendiğinde form'daki değerleri console'a yazma
  constructor() {
    this.skillsForm.valueChanges.subscribe(value => {
      console.log('Güncel Form Değeri:', value);
    });
  }
}

