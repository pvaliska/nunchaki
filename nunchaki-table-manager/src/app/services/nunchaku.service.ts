import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Nunchaku {
  id: string;
  name: string;
  material: string;
  length: number;
  weight: number;
}

@Injectable({
  providedIn: 'root'
})
export class NunchakuService {
  private readonly API_URL = `${environment.apiUrl}/nunchaku`;

  constructor(private http: HttpClient) {}

  getNunchaku(): Observable<Nunchaku[]> {
    return this.http.get<Nunchaku[]>(this.API_URL);
  }

  getNunchakuById(id: string): Observable<Nunchaku> {
    return this.http.get<Nunchaku>(`${this.API_URL}/${id}`);
  }

  createNunchaku(nunchaku: Omit<Nunchaku, 'id'>): Observable<Nunchaku> {
    return this.http.post<Nunchaku>(this.API_URL, nunchaku);
  }

  updateNunchaku(id: string, nunchaku: Omit<Nunchaku, 'id'>): Observable<Nunchaku> {
    return this.http.put<Nunchaku>(`${this.API_URL}/${id}`, nunchaku);
  }

  deleteNunchaku(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
} 