/// <reference types="jasmine" />
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { NunchakuManagerComponent } from './table-manager.component';
import { NunchakuService } from '../../services/nunchaku.service';
import { TEST_NUNCHAKU, BASE_URL, API_PATHS, HTTP_RESPONSES } from '../../testing/test-data';

describe('NunchakuManagerComponent', () => {
  let component: NunchakuManagerComponent;
  let fixture: ComponentFixture<NunchakuManagerComponent>;
  let httpMock: HttpTestingController;
  let nunchakuService: NunchakuService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        NoopAnimationsModule,
        HttpClientTestingModule,
        MatDialogModule,
        NunchakuManagerComponent
      ],
      providers: [NunchakuService]
    }).compileComponents();

    fixture = TestBed.createComponent(NunchakuManagerComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    nunchakuService = TestBed.inject(NunchakuService);
  });

  afterEach(() => {
    // Flush any pending requests
    httpMock.match(`${BASE_URL}${API_PATHS.NUNCHAKU}`).forEach(req => req.flush([]));
    httpMock.verify();
  });

  it('should create', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    expect(component).toBeTruthy();
  }));

  it('should load nunchaku list on init', fakeAsync(() => {
    fixture.detectChanges();
    
    // Get all requests for the endpoint
    const requests = httpMock.match(`${BASE_URL}${API_PATHS.NUNCHAKU}`);
    expect(requests.length).toBeGreaterThan(0);
    
    // Respond to all requests
    requests.forEach(req => {
      expect(req.request.method).toBe('GET');
      req.flush([TEST_NUNCHAKU], HTTP_RESPONSES.GET);
    });
    
    tick(); // Process all pending asynchronous activities
    
    // Verify component state
    expect(component.nunchaku).toEqual([TEST_NUNCHAKU]);
    expect(component.isLoading).toBeFalse();
  }));

  it('should handle error when loading nunchaku list', fakeAsync(() => {
    fixture.detectChanges();
    
    // Get all requests for the endpoint
    const requests = httpMock.match(`${BASE_URL}${API_PATHS.NUNCHAKU}`);
    expect(requests.length).toBeGreaterThan(0);
    
    // Respond to all requests with error
    requests.forEach(req => {
      expect(req.request.method).toBe('GET');
      req.error(new ErrorEvent('Network error'));
    });
    
    tick(); // Process all pending asynchronous activities
    
    // Verify component state
    expect(component.nunchaku).toEqual([]);
    expect(component.isLoading).toBeFalse();
  }));

  it('should delete nunchaku and update list', fakeAsync(() => {
    // Set initial state
    component.nunchaku = [TEST_NUNCHAKU];
    fixture.detectChanges();
    
    // Trigger delete
    component.deleteNunchaku(TEST_NUNCHAKU.id);
    
    // Verify HTTP call
    const req = httpMock.expectOne(`${BASE_URL}${API_PATHS.NUNCHAKU_BY_ID(TEST_NUNCHAKU.id)}`);
    expect(req.request.method).toBe('DELETE');
    
    // Mock successful response
    req.flush(null, HTTP_RESPONSES.DELETE);
    
    tick(); // Process all pending asynchronous activities
    
    // Verify component state
    expect(component.nunchaku).toEqual([]);
  }));

  it('should handle error when deleting nunchaku', fakeAsync(() => {
    // Set initial state
    component.nunchaku = [TEST_NUNCHAKU];
    fixture.detectChanges();
    
    // Trigger delete
    component.deleteNunchaku(TEST_NUNCHAKU.id);
    
    // Verify HTTP call
    const req = httpMock.expectOne(`${BASE_URL}${API_PATHS.NUNCHAKU_BY_ID(TEST_NUNCHAKU.id)}`);
    expect(req.request.method).toBe('DELETE');
    
    // Mock error response
    req.error(new ErrorEvent('Network error'));
    
    tick(); // Process all pending asynchronous activities
    
    // Verify component state - should remain unchanged
    expect(component.nunchaku).toEqual([TEST_NUNCHAKU]);
  }));
}); 