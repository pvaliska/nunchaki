import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Nunchaku } from '../../services/nunchaku.service';

@Component({
  selector: 'app-nunchaku-card-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './nunchaku-card-list.component.html'
})
export class NunchakuCardListComponent {
  @Input() nunchaku: Nunchaku[] = [];
  @Output() edit = new EventEmitter<Nunchaku>();
  @Output() delete = new EventEmitter<string>();

  onEdit(n: Nunchaku) {
    this.edit.emit(n);
  }

  onDelete(id: string) {
    this.delete.emit(id);
  }
}
