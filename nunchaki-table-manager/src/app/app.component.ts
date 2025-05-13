import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NunchakuManagerComponent } from './components/table-manager/table-manager.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    NunchakuManagerComponent,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <mat-toolbar color="primary">
      <span>{{ title }}</span>
    </mat-toolbar>
    <div>
      <app-nunchaku-manager></app-nunchaku-manager>
    </div>
  `
})
export class AppComponent {
  title = 'Nunchaku Manager';
}
