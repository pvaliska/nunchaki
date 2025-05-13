import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { isPlatformBrowser } from '@angular/common';

export interface Nunchaku {
  id: string;
  name: string;
  material: string;
  length: number;
  weight: number;
}

function generateUUID(): string {
  // Simple UUID v4 generator
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

@Injectable({
  providedIn: 'root'
})
export class NunchakuService {
  private readonly STORAGE_KEY = 'nunchaki_nunchaku';
  private nunchaku: Nunchaku[] = [];
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    if (!this.isBrowser) {
      // Default data for SSR
      this.nunchaku = [
        { id: generateUUID(), name: 'Classic Oak', material: 'Oak Wood', length: 30, weight: 400 },
        { id: generateUUID(), name: 'Foam Trainer', material: 'Foam', length: 28, weight: 250 },
        { id: generateUUID(), name: 'Steel Pro', material: 'Steel', length: 32, weight: 600 }
      ];
      return;
    }
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      this.nunchaku = JSON.parse(stored);
    } else {
      this.nunchaku = [
        { id: generateUUID(), name: 'Classic Oak', material: 'Oak Wood', length: 30, weight: 400 },
        { id: generateUUID(), name: 'Foam Trainer', material: 'Foam', length: 28, weight: 250 },
        { id: generateUUID(), name: 'Steel Pro', material: 'Steel', length: 32, weight: 600 }
      ];
      this.saveToStorage();
    }
  }

  private saveToStorage(): void {
    if (this.isBrowser) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.nunchaku));
    }
  }

  getNunchaku(): Observable<Nunchaku[]> {
    return of(this.nunchaku);
  }

  getNunchakuById(id: string): Observable<Nunchaku | undefined> {
    return of(this.nunchaku.find(n => n.id === id));
  }

  createNunchaku(nunchaku: Omit<Nunchaku, 'id'>): Observable<Nunchaku> {
    const newNunchaku = { ...nunchaku, id: generateUUID() };
    this.nunchaku = [...this.nunchaku, newNunchaku];
    this.saveToStorage();
    return of(newNunchaku);
  }

  updateNunchaku(id: string, nunchaku: Partial<Nunchaku>): Observable<Nunchaku> {
    const index = this.nunchaku.findIndex(n => n.id === id);
    if (index === -1) {
      throw new Error(`Nunchaku with id ${id} not found`);
    }
    const updatedNunchaku = { ...this.nunchaku[index], ...nunchaku };
    this.nunchaku[index] = updatedNunchaku;
    this.saveToStorage();
    return of(updatedNunchaku);
  }

  deleteNunchaku(id: string): Observable<void> {
    const index = this.nunchaku.findIndex(n => n.id === id);
    if (index === -1) {
      throw new Error(`Nunchaku with id ${id} not found`);
    }
    this.nunchaku = this.nunchaku.filter(n => n.id !== id);
    this.saveToStorage();
    return of(void 0);
  }
} 