import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

interface HistoricalPoint {
  timestamp: Date;
  value: number;
}

interface controlChart {
  id: string;
  title: string;
  unit: string;
  color: string;
  rawData: HistoricalPoint[];
  filteredData: HistoricalPoint[];
  options: EChartsOption;
  startDate: string;
  endDate: string;
}

@Component({
  selector: 'app-control',
  imports: [
    CommonModule,
    NgxEchartsDirective,
    FormsModule,
    MultiSelectModule,
    ToastModule,
    ButtonModule,
  ],
  templateUrl: './control.html',
  styleUrl: './control.scss',
  providers: [MessageService],
})
export class Control implements OnInit, OnDestroy {
  controlCharts: controlChart[] = [];
  isBrowser = false;
  currentControl: string | null = null;
  currentItems: string[] = [];
  selectedData: any = [];
  dataOptions: any = [];
  selectionError = false;
  maxSelect = 5;
  // Mapping from item query parameter values to chart configurations
  private itemConfigMap: {
    [key: string]: { id: string; title: string; unit: string; color: string };
  } = {
    status: {
      id: 'status',
      title: 'Status (On/Off)',
      unit: '',
      color: '#28a745',
    },

    controlMode: {
      id: 'controlMode',
      title: 'Control Mode (On, Off, System Timer)',
      unit: '',
      color: '#007bff',
    },

    schedule: {
      id: 'schedule',
      title: 'Schedule',
      unit: '',
      color: '#6f42c1',
    },

    inverterControlMode: {
      id: 'inverterControlMode',
      title: 'Control Mode (Inverter)',
      unit: '',
      color: '#17a2b8',
    },

    inverterFrequency: {
      id: 'inverterFrequency',
      title: 'Inverter Frequency',
      unit: 'Hz',
      color: '#fd7e14',
    },

    chilledWaterValveControlMode: {
      id: 'chilledWaterValveControlMode',
      title: 'Control Mode (Chilled Water Valve)',
      unit: '',
      color: '#20c997',
    },

    valvePosition: {
      id: 'valvePosition',
      title: 'Valve Position',
      unit: '%',
      color: '#ffc107',
    },

    controlSetpoint: {
      id: 'controlSetpoint',
      title: 'Control Setpoint',
      unit: '°C',
      color: '#dc3545',
    },

    chilledWaterPumpControlMode: {
      id: 'chilledWaterPumpControlMode',
      title: 'Control Mode (Chilled Water Pump)',
      unit: '',
      color: '#6610f2',
    },

    supplyAirDamperControlMode: {
      id: 'supplyAirDamperControlMode',
      title: 'Control Mode (Supply Air Damper)',
      unit: '',
      color: '#0d6efd',
    },

    returnAirDamperControlMode: {
      id: 'returnAirDamperControlMode',
      title: 'Control Mode (Return Air Damper)',
      unit: '',
      color: '#198754',
    },

    isoDamperControlMode: {
      id: 'isoDamperControlMode',
      title: 'Control Mode (ISO Damper)',
      unit: '',
      color: '#adb5bd',
    },

    freshAirDamperControlMode: {
      id: 'freshAirDamperControlMode',
      title: 'Control Mode (Fresh Air Damper)',
      unit: '',
      color: '#0dcaf0',
    },

    overrideDamper: {
      id: 'overrideDamper',
      title: 'Override Damper',
      unit: '',
      color: '#6c757d',
    },

    fadSetpoint: {
      id: 'fadSetpoint',
      title: 'FAD Setpoint',
      unit: '%',
      color: '#ff6f61',
    },
  };

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const name = params.get('name');
      const items = params.getAll('item');

      this.currentControl = name;
      this.currentItems = items.length > 0 ? items : Object.keys(this.itemConfigMap); // Default to all if no items specified


      this.getDropdown();
    });
  }

  ngOnDestroy(): void {
    this.dataOptions = [];
  }
  getDropdown() {
    const getDropdown = this.currentItems.map((item: any) => ({
      name: this.itemConfigMap[item].title,
      value: item,
    }));
    
    this.dataOptions = getDropdown;
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
    console.log(items)
    this.getGraph('control', items);
  }
  getGraph(control: string | null, items: string[] = []) {
    if (!this.isBrowser) {
      return;
    }

    const today = new Date();
    const days = 90;

    // Filter chart configurations based on items query parameter
    const chartConfigs = items
      .filter((item) => this.itemConfigMap[item]) // Only include items that have a configuration
      .map((item) => this.itemConfigMap[item]);

      console.log(chartConfigs)
    // If no valid items, use all available configurations
    const configsToUse = chartConfigs.length > 0 ? chartConfigs : Object.values(this.itemConfigMap);

    this.controlCharts = configsToUse.map((cfg, idx) => {
      const rawData = this.generateMockSeries(today, days, idx);
      const defaultStart = this.toInputDate(this.addDays(today, -7));
      const defaultEnd = this.toInputDate(today);
      const filteredData = this.filterByRange(rawData, defaultStart, defaultEnd);

      return {
        ...cfg,
        rawData,
        filteredData,
        options: this.buildOptions(cfg.title, cfg.unit, cfg.color, filteredData),
        startDate: defaultStart,
        endDate: defaultEnd,
      };
    });
  }

  setQuickRange(chart: controlChart, daysBack: number): void {
    const today = new Date();
    chart.startDate = this.toInputDate(this.addDays(today, -daysBack));
    chart.endDate = this.toInputDate(today);
    this.onDateChange(chart);
  }

  private toInputDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onDateChange(chart: controlChart): void {
    if (!chart.startDate || !chart.endDate) {
      return;
    }

    const filtered = this.filterByRange(chart.rawData, chart.startDate, chart.endDate);
    chart.filteredData = filtered;
    chart.options = this.buildOptions(chart.title, chart.unit, chart.color, filtered);
  }
  private addDays(date: Date, diff: number): Date {
    const d = new Date(date);
    d.setDate(d.getDate() + diff);
    return d;
  }

  private filterByRange(data: HistoricalPoint[], start: string, end: string): HistoricalPoint[] {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return data.filter(
      (p) => p.timestamp >= this.atStartOfDay(startDate) && p.timestamp <= this.atEndOfDay(endDate),
    );
  }

  private generateMockSeries(endDate: Date, days: number, seedOffset: number): HistoricalPoint[] {
    const data: HistoricalPoint[] = [];
    const start = this.addDays(endDate, -days + 1);

    let base = 20 + seedOffset * 2;
    for (let i = 0; i < days; i++) {
      const ts = this.addDays(start, i);
      const dailyVariation = Math.sin((i / days) * Math.PI * 2) * 3;
      const randomNoise = (Math.random() - 0.5) * 2;
      const value = Math.round((base + dailyVariation + randomNoise) * 10) / 10;
      data.push({ timestamp: ts, value });
    }
    return data;
  }
  private buildOptions(
    title: string,
    unit: string,
    color: string,
    seriesData: HistoricalPoint[],
  ): EChartsOption {
    return {
      tooltip: {
        trigger: 'axis',
        valueFormatter: (value: unknown) =>
          typeof value === 'number' ? `${value} ${unit}` : `${value}`,
      },
      grid: { left: 50, right: 20, top: 40, bottom: 40 },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: seriesData.map((p) => this.toLabelDate(p.timestamp)),
        splitLine: {
          show: false,
        },
        axisLabel: {
          color: '#FFFFFF',
        },
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          color: '#FFFFFF',
          formatter: (val: number) => `${val}${unit}`,
        },
        splitLine: {
          show: false,
        },
      },
      series: [
        {
          name: title,
          type: 'line',
          smooth: false,
          showSymbol: false,
          itemStyle: { color },
          lineStyle: { width: 2, color },
          data: seriesData.map((p) => p.value),
        },
      ],
    };
  }

  private toLabelDate(date: Date): string {
    return `${date.getMonth() + 1}/${date.getDate()}`;
  }

  private atStartOfDay(date: Date): Date {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  private atEndOfDay(date: Date): Date {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
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
