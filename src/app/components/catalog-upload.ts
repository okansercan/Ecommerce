import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpEventType, HttpEvent } from '@angular/common/http';
import { Product } from '../services/product';

@Component({
  selector: 'app-catalog-upload',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-semibold text-gray-800 flex items-center">
          <svg class="w-6 h-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
          </svg>
          Ürün Kataloğu Yükle
        </h3>
        <span class="text-sm text-gray-500 bg-blue-50 px-3 py-1 rounded-full">PDF Dosyası</span>
      </div>

      <!-- Upload Area -->
      <div class="relative">
        <input
          #fileInput
          type="file"
          accept=".pdf"
          (change)="onFileSelected($event)"
          class="hidden"
          id="catalog-upload"
        />
        
        <label
          for="catalog-upload"
          class="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
          [class.border-blue-400]="isDragOver()"
          [class.bg-blue-50]="isDragOver()"
          (dragover)="onDragOver($event)"
          (dragleave)="onDragLeave($event)"
          (drop)="onDrop($event)"
        >
          <div class="flex flex-col items-center justify-center pt-5 pb-6">
            <svg class="w-8 h-8 mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
            <p class="mb-2 text-sm text-gray-500">
              <span class="font-semibold">Dosya seçmek için tıklayın</span> veya sürükleyin
            </p>
            <p class="text-xs text-gray-500">Sadece PDF dosyaları (MAX. 10MB)</p>
          </div>
        </label>
      </div>

      <!-- Selected File Info -->
      @if (selectedFile()) {
        <div class="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <svg class="w-8 h-8 text-red-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd"></path>
              </svg>
              <div>
                <p class="font-medium text-gray-900">{{ selectedFile()!.name }}</p>
                <p class="text-sm text-gray-500">{{ formatFileSize(selectedFile()!.size) }}</p>
              </div>
            </div>
            <button
              (click)="clearFile()"
              class="text-gray-400 hover:text-gray-600 transition-colors"
              type="button"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
              </svg>
            </button>
          </div>
        </div>
      }

      <!-- Progress Bar -->
      @if (uploadProgress() > 0 && uploadProgress() < 100) {
        <div class="mt-4">
          <div class="flex justify-between text-sm text-gray-600 mb-2">
            <span class="flex items-center">
              <svg class="animate-spin w-4 h-4 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Dosya yükleniyor...
            </span>
            <span class="font-semibold">{{ uploadProgress() }}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
            <div 
              class="h-full bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 rounded-full transition-all duration-500 ease-out relative overflow-hidden"
              [style.width.%]="uploadProgress()"
            >
              <!-- Animated shine effect -->
              <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
            </div>
          </div>
          <div class="mt-2 text-xs text-gray-500 flex justify-between">
            <span>{{ formatFileSize(getUploadedBytes()) }} / {{ formatFileSize(selectedFile()?.size || 0) }}</span>
            <span>Tahmini süre: {{ getEstimatedTime() }}</span>
          </div>
        </div>
      }

      <!-- Success Message -->
      @if (uploadProgress() === 100) {
        <div class="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
            <span class="text-green-800 font-medium">Katalog başarıyla yüklendi!</span>
          </div>
        </div>
      }

      <!-- Error Message -->
      @if (errorMessage()) {
        <div class="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-red-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
            </svg>
            <span class="text-red-800">{{ errorMessage() }}</span>
          </div>
        </div>
      }

      <!-- Upload Button -->
      <div class="mt-6 flex justify-end">
        <button
          (click)="uploadFile()"
          [disabled]="!selectedFile() || isUploading()"
          class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          @if (isUploading()) {
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Yükleniyor...
          } @else {
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
            Kataloğu Yükle
          }
        </button>
      </div>
    </div>
  `
})
export class CatalogUploadComponent {
  selectedFile = signal<File | null>(null);
  uploadProgress = signal(0);
  isUploading = signal(false);
  errorMessage = signal<string>('');
  dragOverCounter = 0;
  private uploadStartTime = 0;

  constructor(private productService: Product) {}

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    this.handleFile(file);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.dragOverCounter++;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.dragOverCounter--;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.dragOverCounter = 0;
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  isDragOver(): boolean {
    return this.dragOverCounter > 0;
  }

  private handleFile(file: File): void {
    this.errorMessage.set('');
    
    // File type validation
    if (file.type !== 'application/pdf') {
      this.errorMessage.set('Lütfen sadece PDF dosyası seçiniz.');
      return;
    }

    // File size validation (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      this.errorMessage.set('Dosya boyutu 10MB\'dan büyük olamaz.');
      return;
    }

    this.selectedFile.set(file);
    this.uploadProgress.set(0);
  }

  clearFile(): void {
    this.selectedFile.set(null);
    this.uploadProgress.set(0);
    this.errorMessage.set('');
  }

  uploadFile(): void {
    const file = this.selectedFile();
    if (!file) return;

    this.isUploading.set(true);
    this.errorMessage.set('');
    this.uploadProgress.set(0);
    this.uploadStartTime = Date.now();

    this.productService.uploadProductCatalog(file).subscribe({
      next: (event: HttpEvent<any>) => {
        if (event.type === HttpEventType.UploadProgress) {
          const percent = Math.round(100 * (event.loaded / (event.total ?? 1)));
          this.uploadProgress.set(percent);
        } else if (event.type === HttpEventType.Response) {
          this.uploadProgress.set(100);
          this.isUploading.set(false);
          // Reset after 3 seconds
          setTimeout(() => {
            this.clearFile();
          }, 3000);
        }
      },
      error: (error: any) => {
        this.isUploading.set(false);
        this.uploadProgress.set(0);
        
        if (error.status === 413) {
          this.errorMessage.set('Dosya çok büyük. Lütfen daha küçük bir dosya seçiniz.');
        } else if (error.status === 415) {
          this.errorMessage.set('Dosya formatı desteklenmiyor. Lütfen PDF dosyası seçiniz.');
        } else if (error.status === 0) {
          this.errorMessage.set('Bağlantı hatası. Lütfen internet bağlantınızı kontrol ediniz.');
        } else {
          this.errorMessage.set('Yükleme sırasında bir hata oluştu. Lütfen tekrar deneyiniz.');
        }
      }
    });
  }

  getUploadedBytes(): number {
    const file = this.selectedFile();
    if (!file) return 0;
    return Math.round((this.uploadProgress() / 100) * file.size);
  }

  getEstimatedTime(): string {
    const progress = this.uploadProgress();
    if (progress === 0) return '--';
    
    const elapsed = Date.now() - this.uploadStartTime;
    const rate = progress / elapsed; // progress per ms
    const remaining = (100 - progress) / rate; // ms remaining
    
    const seconds = Math.round(remaining / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ${seconds % 60}s`;
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}