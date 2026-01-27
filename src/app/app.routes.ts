import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { Graph } from './graph/graph';
import { Control } from './control/control';
// import { FcuControl } from './fcu/fcu-control/fcu-control';
// import { FcuGraph } from './fcu/fcu-graph/fcu-graph';

export const routes: Routes = [
  {
    path: '',
    component: Graph,
  },
  {
    path: 'ahu',
    children: [
      { path: 'status', component: Graph },
      { path: 'control', component: Graph },
      { path: 'vsd', component: Graph },
    ],
  },
    {
    path: 'fcu',
    children: [
      { path: 'status', component: Graph },
      { path: 'control', component: Control },
    ],
  },
];
