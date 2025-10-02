import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero-banner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero-banner.html',
  styleUrls: ['./hero-banner.scss']
})
export class HeroBannerComponent {
  @Input() title: string = 'Yaz Koleksiyonu 2024';
  @Input() subtitle: string = '%50\'ye Varan İndirimler';
  @Input() image: string = 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80';
  @Input() buttonText: string = 'Koleksiyonu Keşfet';
  
  showAlert() {
    alert('Alışverişe başlayın!');
  }
}