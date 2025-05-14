/// <reference types="jasmine" />
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NunchakuDialogComponent } from './table-dialog.component';
import { Nunchaku, NunchakuService } from '../../services/nunchaku.service';
import { environment } from '../../../environments/environment';
import { TEST_NUNCHAKU, TEST_NUNCHAKU_PAYLOAD, BASE_URL, API_PATHS, HTTP_RESPONSES } from '../../testing/test-data';

describe('NunchakuDialogComponent', () => {
  let component: NunchakuDialogComponent;
  let fixture: ComponentFixture<NunchakuDialogComponent>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<NunchakuDialogComponent>>;
  let httpMock: HttpTestingController;
  let nunchakuService: NunchakuService;

  beforeEach(async () => {
    dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatDialogModule,
        NoopAnimationsModule,
        HttpClientTestingModule,
        NunchakuDialogComponent
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { nunchaku: null } },
        NunchakuService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NunchakuDialogComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    nunchakuService = TestBed.inject(NunchakuService);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form for new nunchaku', () => {
    expect(component.form.get('name')?.value).toBe('');
    expect(component.form.get('material')?.value).toBe('');
    expect(component.form.get('length')?.value).toBeNull();
    expect(component.form.get('weight')?.value).toBeNull();
    expect(component.dialogTitle).toBe('Add Nunchaku');
  });

  it('should initialize with existing nunchaku data', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatDialogModule,
        NoopAnimationsModule,
        HttpClientTestingModule,
        NunchakuDialogComponent
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { nunchaku: TEST_NUNCHAKU } },
        NunchakuService
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(NunchakuDialogComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.form.get('name')?.value).toBe(TEST_NUNCHAKU.name);
    expect(component.form.get('material')?.value).toBe(TEST_NUNCHAKU.material);
    expect(component.form.get('length')?.value).toBe(TEST_NUNCHAKU.length);
    expect(component.form.get('weight')?.value).toBe(TEST_NUNCHAKU.weight);
    expect(component.dialogTitle).toBe('Edit Nunchaku');
  });

  it('should not submit invalid form', () => {
    component.onSubmit();
    expect(dialogRef.close).not.toHaveBeenCalled();
  });

  it('should submit valid form and make correct API call', fakeAsync(() => {
    component.form.patchValue(TEST_NUNCHAKU_PAYLOAD);
    component.onSubmit();

    // Verify HTTP call
    const req = httpMock.expectOne(`${BASE_URL}${API_PATHS.NUNCHAKU}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(TEST_NUNCHAKU_PAYLOAD);
    
    // Mock successful response
    req.flush(TEST_NUNCHAKU, HTTP_RESPONSES.POST);
    
    tick(); // Process all pending asynchronous activities
    
    // Verify dialog close with response data
    expect(dialogRef.close).toHaveBeenCalledWith(TEST_NUNCHAKU);
  }));

  it('should update existing nunchaku', fakeAsync(() => {
    // Reset component with existing nunchaku
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatDialogModule,
        NoopAnimationsModule,
        HttpClientTestingModule,
        NunchakuDialogComponent
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { nunchaku: TEST_NUNCHAKU } },
        NunchakuService
      ]
    }).compileComponents();

    const fixture = TestBed.createComponent(NunchakuDialogComponent);
    const component = fixture.componentInstance;
    const httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();

    component.form.patchValue(TEST_NUNCHAKU_PAYLOAD);
    component.onSubmit();

    // Verify HTTP call
    const req = httpMock.expectOne(`${BASE_URL}${API_PATHS.NUNCHAKU_BY_ID(TEST_NUNCHAKU.id)}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(TEST_NUNCHAKU_PAYLOAD);
    
    // Mock successful response
    req.flush(TEST_NUNCHAKU, HTTP_RESPONSES.PUT);
    
    tick(); // Process all pending asynchronous activities
    
    // Verify dialog close with response data
    expect(dialogRef.close).toHaveBeenCalledWith(TEST_NUNCHAKU);
  }));

  it('should close dialog on cancel', () => {
    component.onCancel();
    expect(dialogRef.close).toHaveBeenCalled();
  });
}); 