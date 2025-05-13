import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NunchakuManagerComponent } from './table-manager.component';

describe('NunchakuManagerComponent', () => {
  let component: NunchakuManagerComponent;
  let fixture: ComponentFixture<NunchakuManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NunchakuManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NunchakuManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
}); 