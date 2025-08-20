import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Legend,
  Tooltip,
} from 'chart.js';

import { Evolution } from '$/evolution';

Chart.register(
  LinearScale,
  Legend,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
);

export class ChartView {
  private chart;

  constructor(
    private canvas: HTMLCanvasElement,
    private evolution: Evolution,
  ) {
    this.chart = new Chart(this.canvas, {
      type: 'line',
      data: {
        labels: [] as string[],
        datasets: [
          {
            label: 'best',
            data: [] as number[],
            borderColor: 'rgb(75, 192, 192)',
          },
          {
            label: 'median',
            data: [] as number[],
            borderColor: 'rgb(75, 75, 192)',
          },
          {
            label: 'average',
            data: [] as number[],
            borderColor: 'rgb(192, 75, 192)',
          },
          {
            label: 'worst',
            data: [] as number[],
            borderColor: 'rgb(150, 150, 150)',
          },
        ],
      },
      options: {
        scales: {
          y: {
            type: 'linear',
            beginAtZero: true,
            ticks: {
              color: '#aaa',
            },
            grid: {
              color: '#666',
            },
          },
          x: {
            type: 'linear',
            ticks: {
              color: '#aaa',
              stepSize: 1,
            },
            grid: {
              color: '#666',
            },
          },
        },
        responsive: true,
        maintainAspectRatio: false,
        color: '#ffffff',
      },
    });

    evolution.on('generation', () => {
      this.reset();
    });
  }

  reset() {
    this.chart.data.labels = new Array(this.evolution.generations.length);
    this.chart.data.datasets[0].data = new Array(
      this.evolution.generations.length,
    );
    this.chart.data.datasets[1].data = new Array(
      this.evolution.generations.length,
    );
    this.chart.data.datasets[2].data = new Array(
      this.evolution.generations.length,
    );
    this.chart.data.datasets[3].data = new Array(
      this.evolution.generations.length,
    );

    for (const generation of this.evolution.generations) {
      const i = generation.index;
      this.chart.data.labels![i] = i.toString();
      this.chart.data.datasets[0].data[i] = generation.bestX;
      this.chart.data.datasets[1].data[i] = generation.medianX;
      this.chart.data.datasets[2].data[i] = generation.averageX;
      this.chart.data.datasets[3].data[i] = generation.worstX;
    }

    this.chart.update();
  }

  update() {
    this.chart.update();
  }
}
