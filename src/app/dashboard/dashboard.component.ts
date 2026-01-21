import { Component, OnInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Router } from '@angular/router';



@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule,],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  constructor(private router: Router) {
  }
  ngOnInit(): void {
  }

  routeToGraph(): void {
    // Placeholder for routing to the graph component
    // this.router.navigate(['/graph'], {
    //   queryParams: {
    //     ahu: 'AHU-01',
    //     item: ['RATemp', 'OATemp', 'Closed'],
    //   },
    // });

    // this.router.navigate([['http://localhost:4200/graph/']])
    window.location.href = 'http://localhost:4200/graph?ahu=AHU-01&item=RATemp&item=OATemp&item=OADamper&item=MIXTemp&item=SWPStatus&item=FilterStatus&item=CCDATemp&item=SATemp&item=DiffPress&item=StatusPress&item=ISODamper&item=SADamper'; //Will take you to Google.
  }
}
