import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxEchartsDirective } from 'ngx-echarts';
import type { EChartsOption } from 'echarts';

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
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxEchartsDirective],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  ahuCharts: AhuChart[] = [];

  ngOnInit(): void {
    const today = new Date();
    const days = 30;

    const chartConfigs = [
      { id: 'returnTemp', title: 'RA Temperature', unit: '°C', color: '#28a745' },
      { id: 'supplyTemp', title: 'SA Temperature', unit: '°C', color: '#007bff' },
      { id: 'outdoorTemp', title: 'OA Temperature', unit: '°C', color: '#ffc107' },
      { id: 'outdoorTemp', title: 'CCPA Temperature', unit: '°C', color: '#ffc107' },
      { id: 'coolingValve', title: 'Valve Position', unit: '%', color: '#dc3545' },
    //   { id: 'mixedTemp', title: 'Mixed Air Temperature', unit: '°C', color: '#ffc107' },
    //   { id: 'fanSpeed', title: 'Supply Fan Speed', unit: '%', color: '#17a2b8' },
    
    ];

    this.ahuCharts = chartConfigs.map((cfg, idx) => {
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

  onDateChange(chart: AhuChart): void {
    if (!chart.startDate || !chart.endDate) {
      return;
    }

    const filtered = this.filterByRange(chart.rawData, chart.startDate, chart.endDate);
    chart.filteredData = filtered;
    chart.options = this.buildOptions(chart.title, chart.unit, chart.color, filtered);
  }

  setQuickRange(chart: AhuChart, daysBack: number): void {
    const today = new Date();
    chart.startDate = this.toInputDate(this.addDays(today, -daysBack));
    chart.endDate = this.toInputDate(today);
    this.onDateChange(chart);
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

  private filterByRange(data: HistoricalPoint[], start: string, end: string): HistoricalPoint[] {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return data.filter(
      (p) => p.timestamp >= this.atStartOfDay(startDate) && p.timestamp <= this.atEndOfDay(endDate),
    );
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
        valueFormatter: (value: unknown) => (typeof value === 'number' ? `${value} ${unit}` : `${value}`),
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

  private addDays(date: Date, diff: number): Date {
    const d = new Date(date);
    d.setDate(d.getDate() + diff);
    return d;
  }

  private toInputDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
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
}

