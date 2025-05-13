import { Routes } from '@angular/router';
import { NunchakuManagerComponent } from './components/table-manager/table-manager.component';

export const routes: Routes = [
  { path: '', redirectTo: 'tables', pathMatch: 'full' },
  { path: 'tables', component: NunchakuManagerComponent }
];
