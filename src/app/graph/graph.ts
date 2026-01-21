import { Component, OnInit } from '@angular/core';
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

interface AhuChart {
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
  selector: 'app-graph',
  imports: [CommonModule, NgxEchartsDirective, FormsModule, MultiSelectModule, ToastModule, ButtonModule],
  templateUrl: './graph.html',
  styleUrl: './graph.scss',
  providers: [MessageService]
})
export class Graph implements OnInit {
  ahuCharts: AhuChart[] = [];
  isBrowser = false;
  currentAhu: string | null = null;
  currentItems: string[] = [];
  selectedData: any = [];
  DataOptions: any = [];
  selectionError = false;
  maxSelect = 5;
  // Mapping from item query parameter values to chart configurations
  private itemConfigMap: {
    [key: string]: { id: string; title: string; unit: string; color: string };
  } = {
    RATemp: { id: 'returnTemp', title: 'RA Temperature', unit: '°C', color: '#28a745' },
    SATemp: { id: 'supplyTemp', title: 'SA Temperature', unit: '°C', color: '#007bff' },
    OATemp: { id: 'outdoorTemp', title: 'OA Temperature', unit: '°C', color: '#ffc107' },
    OADamper: { id: 'OADamper', title: 'CCPA Temperature', unit: '°C', color: '#ff9800' },
    MIXTemp: { id: 'MIXTemp', title: 'MIX Temp', unit: '%', color: '#dc3545' },
    SWPStatus: { id: 'SWPStatus', title: 'SWP Status', unit: '%', color: '#dc3545' },
    FilterStatus: {
      id: 'FilterStatus',
      title: 'Filter Status',
      unit: '°C',
      color: '#9c27b0',
    },
    CCDATemp: { id: 'CCDATemp', title: 'CCDA Temperature', unit: '%', color: '#17a2b8' },
    DiffPress: { id: 'DiffPress', title: 'Differential Pressure', unit: 'Pa', color: '#6f42c1' },
    StatusPress: { id: 'StatusPress', title: 'Static Pressure', unit: 'Pa', color: '#20c997' },
    ISODamper: { id: 'ISODamper', title: 'Inlet Side Damper', unit: '%', color: '#fd7e14' },
    SADamper: { id: 'SADamper', title: 'Secondary Air Damper', unit: '%', color: '#17a2b8' },
  };

  constructor(
    @Inject(PLATFORM_ID) platformId: Object,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const ahu = params.get('ahu');
      const items = params.getAll('item');

      this.currentAhu = ahu;
      this.currentItems = items.length > 0 ? items : Object.keys(this.itemConfigMap); // Default to all if no items specified

      this.getDropdown();
      // this.getGraph(ahu, this.currentItems);
    });
  }

  getDropdown() {
    const getDropdown = this.currentItems.map((item: any) => ({
      name: item,
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
      this.showToast()
    }
  }
  getData(){
    const items = this.selectedData.map((item:any) => item.value)
    this.getGraph('ahu', items);
  }
  getGraph(ahu: string | null, items: string[] = []) {
    if (!this.isBrowser) {
      return;
    }

    const today = new Date();
    const days = 90;

    // Filter chart configurations based on items query parameter
    const chartConfigs = items
      .filter((item) => this.itemConfigMap[item]) // Only include items that have a configuration
      .map((item) => this.itemConfigMap[item]);


    // If no valid items, use all available configurations
    const configsToUse = chartConfigs.length > 0 ? chartConfigs : Object.values(this.itemConfigMap);

    this.ahuCharts = configsToUse.map((cfg, idx) => {
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

  setQuickRange(chart: AhuChart, daysBack: number): void {
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

  onDateChange(chart: AhuChart): void {
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
  private showToast(){
    this.messageService.add({ severity: 'error', summary: 'Opps!', detail: 'You can select a maximum of 5 data.', life: 3000 });
  }
  
}
