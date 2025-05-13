import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NunchakuCardListComponent } from '../nunchaku-card-list/nunchaku-card-list.component';
import { NunchakuService } from '../../services/nunchaku.service';
import { Nunchaku } from '../../services/nunchaku.service';
import { ShowOnDirtyOrTouchedErrorStateMatcher } from '../../utils/only-show-error-on-touch-or-dirty.matcher';
import { ErrorStateMatcher } from '@angular/material/core';

@Component({
  selector: 'app-nunchaku-manager',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatTableModule,
    MatToolbarModule,
    NunchakuCardListComponent
  ],
  templateUrl: './table-manager.component.html'
})
export class NunchakuManagerComponent implements OnInit {
  nunchaku: Nunchaku[] = [];
  addForm: FormGroup;
  isLoading = false;
  matcher = new ShowOnDirtyOrTouchedErrorStateMatcher();

  constructor(
    private nunchakuService: NunchakuService,
    private fb: FormBuilder
  ) {
    this.addForm = this.fb.group({
      name: ['', Validators.required],
      material: [''],
      length: [null],
      weight: [null]
    });
  }

  ngOnInit() {
    this.loadNunchaku();
  }

  loadNunchaku() {
    this.isLoading = true;
    this.nunchakuService.getNunchaku().subscribe({
      next: (data) => {
        this.nunchaku = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading nunchaku:', error);
        this.isLoading = false;
      }
    });
  }

  onAddSubmit() {
    if (this.addForm.valid) {
      this.isLoading = true;
      const newNunchaku: Omit<Nunchaku, 'id'> = {
        name: this.addForm.value.name,
        material: this.addForm.value.material,
        length: this.addForm.value.length,
        weight: this.addForm.value.weight
      };

      this.nunchakuService.createNunchaku(newNunchaku).subscribe({
        next: (response) => {
          this.nunchaku = [...this.nunchaku, response];
          this.addForm.reset();
          this.addForm.markAsPristine();
          this.addForm.markAsUntouched();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error adding nunchaku:', error);
          this.isLoading = false;
        }
      });
    }
  }

  deleteNunchaku(id: string) {
    this.isLoading = true;
    this.nunchakuService.deleteNunchaku(id).subscribe({
      next: () => {
        this.nunchaku = this.nunchaku.filter(n => n.id !== id);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error deleting nunchaku:', error);
        this.isLoading = false;
      }
    });
  }
}
