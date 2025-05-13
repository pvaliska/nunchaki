import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NunchakuDialogComponent } from './table-dialog.component';

describe('NunchakuDialogComponent', () => {
  let component: NunchakuDialogComponent;
  let fixture: ComponentFixture<NunchakuDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NunchakuDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NunchakuDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
}); 