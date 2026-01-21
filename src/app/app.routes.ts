import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { Graph } from './graph/graph';

export const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },
  {
    path: 'graph',
    component: Graph,
  },
];
