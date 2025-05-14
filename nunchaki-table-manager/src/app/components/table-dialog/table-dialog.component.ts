import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { Nunchaku, NunchakuService } from '../../services/nunchaku.service';

@Component({
  selector: 'app-nunchaku-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './table-dialog.component.html',
  styleUrls: ['./table-dialog.component.scss']
})
export class NunchakuDialogComponent {
  form: FormGroup;
  dialogTitle: string;

  constructor(
    private fb: FormBuilder,
    private nunchakuService: NunchakuService,
    public dialogRef: MatDialogRef<NunchakuDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { nunchaku?: Nunchaku }
  ) {
    this.dialogTitle = data.nunchaku ? 'Edit Nunchaku' : 'Add Nunchaku';
    this.form = this.fb.group({
      name: [data.nunchaku?.name || '', Validators.required],
      material: [data.nunchaku?.material || ''],
      length: [data.nunchaku?.length ?? null],
      weight: [data.nunchaku?.weight ?? null]
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formData = this.form.value;
      if (this.data.nunchaku) {
        this.nunchakuService.updateNunchaku(this.data.nunchaku.id, formData)
          .subscribe(result => this.dialogRef.close(result));
      } else {
        this.nunchakuService.createNunchaku(formData)
          .subscribe(result => this.dialogRef.close(result));
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
