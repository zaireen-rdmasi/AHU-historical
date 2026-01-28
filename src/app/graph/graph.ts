import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { NgxEchartsDirective } from 'ngx-echarts';
import type { EChartsOption } from 'echarts';
import { Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { graphData } from './list_data.development';
import { environmentConfig } from '../../environments/environments.development';
import { HttpService } from '../service/http.service';
import { HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { DatePickerModule } from 'primeng/datepicker';
interface HistoricalPoint {
  timestamp: Date;
  value: number;
}

interface DataCharts {
  id: string;
  title: string;
  value: string;
  config: any;
  unit: string;
  color: string;
  rawData: HistoricalPoint[];
  filteredData: HistoricalPoint[];
  options: EChartsOption;
  startDate: string;
  endDate: string;
  startDateShow: Date;
  endDateShow: Date;
}

@Component({
  selector: 'app-graph',
  imports: [
    CommonModule,
    NgxEchartsDirective,
    FormsModule,
    MultiSelectModule,
    ToastModule,
    ButtonModule,
    DatePickerModule,
  ],
  templateUrl: './graph.html',
  styleUrl: './graph.scss',
  providers: [MessageService, HttpClientModule],
})
export class Graph implements OnInit {
  dataCharts: DataCharts[] = [];
  isBrowser = false;
  currentData: any;
  currentController: any;
  currentItems: string[] = [];
  currentSystem: string = '';
  selectedData: any = [];
  DataOptions: any = [];
  selectionError = false;
  maxSelect = 5;
  private itemConfigMap: any;
  // Mapping from item query parameter values to chart configurations

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private apiConfig: environmentConfig,
    private httpService: HttpService,
    private cdr: ChangeDetectorRef,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    const url = this.router.url;

    if (url.startsWith('/ahu/status')) {
      this.currentSystem = 'ahu status';
    } else if (url.startsWith('/ahu/vsd')) {
      this.currentSystem = 'ahu vsd';
    } else if (url.startsWith('/fcu/status')) {
      this.currentSystem = 'fcu status';
    } else if (url.startsWith('/ahu/control')) {
      this.currentSystem = 'ahu control';
    }

    if (this.currentSystem === 'ahu status') {
      this.itemConfigMap = graphData?.itemConfigMapAHUStatus;
    } else if (this.currentSystem === 'ahu vsd') {
      this.itemConfigMap = graphData?.itemConfigMapAHUVSD;
    } else if (this.currentSystem === 'fcu status') {
      this.itemConfigMap = graphData?.itemConfigMapFCUStatus;
    } else if (this.currentSystem === 'ahu control') {
      this.itemConfigMap = graphData?.itemConfigMapAHUControl;
    }

    this.route.queryParamMap.subscribe((params) => {
      const name = params.get('name');
      const controller = params.get('controller');
      const items = params.getAll('item');

      this.currentData = name;
      this.currentController = controller;
      // Now this will always work since itemConfigMap is never undefined
      if (this.itemConfigMap) {
        this.currentItems = items.length > 0 ? items : Object.keys(this.itemConfigMap);
      }

      this.getDropdown();
    });
  }

  getDropdown() {
    const getDropdown = this.currentItems.map((item: any) => ({
      name: this.itemConfigMap[item].title,
      value: item,
    }));

    this.DataOptions = getDropdown;
  }
  onChanges(event: any) {
    if (this.selectedData.length > this.maxSelect) {
      // Remove the last selected item
      this.selectedData.pop();
      this.selectionError = true;

      // Optional: hide error after 2s
      setTimeout(() => (this.selectionError = false), 2000);
      this.showToast();
    }
  }
  getData() {
    const items = this.selectedData.map((item: any) => item.value);

    // this.getGraphRealData(test);
  }

  apiGetData(data: any = null, type: any = null) {
    const url = this.apiConfig.apiEndPoint + '/historical-data';
    const formData = new FormData();

    formData.append('name', this.currentData);
    formData.append('controller', this.currentController);
    if (data && data.startDate) {
      formData.append('start_date', data.startDate);
    }
    if (data && data.endDate) {
      formData.append('end_date', data.endDate);
    }

    if (type !== 'personal') {
      this.selectedData.forEach((item: any, index: any) => {
        if (item.index !== null) {
          formData.append(`item[${index}]`, this.itemConfigMap[item.value].value);
        }
      });
    } else {
      formData.append(`item[0]`, data.config.value);
    }

    this.httpService.postData(url, formData).subscribe({
      next: (response: any) => {
        // const mapResponse = response.map((x: any) => ({
        //   ...x,
        //   data: x.data.map((y: any) => ({
        //     ...y,
        //     value: y.state ? y.state : y.value,
        //   })),
        // }));

        if (!type) {
          if (this.dataCharts.length !== 0) {
            this.dataCharts = [];
          }
        }
        this.getGraphRealData(response);
      },
      error: (error: any) => {},
    });
  }

  getGraphRealData(items: string[] = []) {
    const chartData = items.map((d: any) => [d.value, d.timestamp]);
    const itemConfigs = Object.values(this.itemConfigMap);

    const matched = items.map((cd: any) => {
      const config = itemConfigs.find((cfg: any) => cfg.value === cd.item);
      return {
        ...cd,
        config,
      };
    });

    const currentData: any = matched.map((cfg: any, idx: any) => {
      const color = cfg.config.color;

      const controlMode: any = {
        0: 'Manual Off',
        1: 'Manual On',
        2: 'System Timer',
      };

      const status: any = {
        0: 'Off',
        1: 'On',
      };

      const isScheduleStatus =
        cfg.config.title.toLowerCase().includes('status') ||
        cfg.config.title.toLowerCase().includes('schedule');
      const isControl = cfg.config.title.toLowerCase().includes('control mode');


      // cfg.title, cfg.unit, cfg.color, filteredData
      return {
        ...cfg,
        id: cfg.config.id,
        options: {
          tooltip: {
            trigger: 'axis',
            valueFormatter: (value: unknown) =>
              typeof value === 'number' ? `${value} ${cfg.config.unit}` : `${value}`,
          },
          grid: { left: 50, right: 20, top: 40, bottom: 40 },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: this.changeDateChart(cfg.data),
            splitLine: {
              show: false,
            },
            axisLabel: {
              color: '#FFFFFF',
            },
          },
          yAxis: isScheduleStatus
            ? {
                type: 'value', // or 'category' if you prefer
                min: 0, // ⬅️ key line
                max: Object.keys(status).length - 1, // number of states - 1
                interval: 1, // key to remove intermediate decimals
                axisLabel: {
                  color: '#FFFFFF',
                  formatter: (v: any) => status[v] ?? '',
                },
              }
            : isControl
              ? {
                  type: 'value', // or 'category' if you prefer
                  min: 0,
                  max: Object.keys(controlMode).length - 1, // number of states - 1
                  interval: 1, // key to remove intermediate decimals
                  axisLabel: {
                    color: '#FFFFFF',
                    formatter: (v: any) => controlMode[v] ?? '',
                  },
                }
              : {
                  type: 'value', // numeric chart
                  axisLabel: {
                    color: '#FFFFFF',
                    formatter: (val: number) => `${val}${cfg.config.unit}`,
                  },
                },

          series: [
            {
              name: cfg.title,
              type: 'line',
              smooth: false,
              showSymbol: false,
              itemStyle: { color },
              lineStyle: { width: 2, color },
              data: cfg.data.map((p: any) => p.value),
            },
          ],
        },
      };
    });
    if (this.dataCharts.length !== 0) {
      const updatedData = this.dataCharts.map((item: any) => {
        if (item.item !== currentData.item) {
          return item; // untouched
        }

        return {
          ...item, // keeps startDate & endDate
          ...currentData, // updates with new data
          startDate: item.startDate,
          endDate: item.endDate,
        };
      });
      this.dataCharts = updatedData;
      this.cdr.markForCheck();
      this.cdr.detectChanges();
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 100);
    } else {
      this.dataCharts = currentData;
      this.cdr.markForCheck();
      this.cdr.detectChanges();

      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 100);
    }
  }

  changeDateChart(data: any) {
    const newDate = data.map((p: any) => {
      const date = new Date(p.timestamp);

      const formatted =
        String(date.getDate()).padStart(2, '0') +
        '-' +
        String(date.getMonth() + 1).padStart(2, '0') +
        '-' +
        date.getFullYear() +
        ' ' +
        String(date.getHours()).padStart(2, '0') +
        ':' +
        String(date.getMinutes()).padStart(2, '0');

      return formatted;
    });

    return newDate;
  }

  onDateChangeRealData(chart: any): void {
    if (!chart.startDate || !chart.endDate) {
      return;
    } else {
      // chart.startDate = this.toInputDate(chart.startDate);
      // chart.endDate = this.toInputDate(chart.endDate);

      this.apiGetData(chart, 'personal');
    }
  }

  setQuickRangeRealData(chart: DataCharts, daysBack: number): void {
    const today = new Date();
    chart.startDate = '';
    chart.endDate = '';
    chart.startDate = this.toInputDate(this.addDays(today, -daysBack));
    chart.endDate = this.toInputDate(today);

    this.apiGetData(chart, 'personal');
  }

  private toInputDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private addDays(date: Date, diff: number): Date {
    const d = new Date(date);
    d.setDate(d.getDate() + diff);
    return d;
  }

  private showToast() {
    this.messageService.add({
      severity: 'error',
      summary: 'Opps!',
      detail: 'You can select a maximum of 5 data.',
      life: 3000,
    });
  }
}
