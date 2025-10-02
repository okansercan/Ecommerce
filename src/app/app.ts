import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { MiniCartComponent } from './components/mini-cart';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, MiniCartComponent, CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss'],
})
export class App {
  constructor(public authService: AuthService) {}
}
