import {ChartConfiguration} from 'chart.js';

export const stubChartData: ChartConfiguration = {
  type: 'line',
  data: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: '2015',
        data: [10, 8, 6, 5, 12, 8, 16, 17, 6, 7, 6, 10],
        lineTension: 0,
        borderColor: '#557ef8',
        backgroundColor: 'rgba(85, 126, 248, 0.5)',
        pointBorderColor: '#e0e0e0',
        pointBackgroundColor: '#fff',
      },
    ],
  },
  options: {
    legend: {
      display: false,
    },
  },
};
