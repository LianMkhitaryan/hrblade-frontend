<script>
import { Line } from 'vue-chartjs';

export default {
  extends: Line,

  name: 'LineChart',

  props: {
    chartData: {
      type: Object,
      default: null
    },

    options: {
      type: Object,
      default: () => {
        return {
          responsive: true,
          maintainAspectRatio: false,
          legend: {
            display: false
          },
          tooltips: {
            displayColors: false
          },
          scales: {
            yAxes: [
              {
                ticks: {
                  suggestedMin: 0
                },
                gridLines: {}
              }
            ],
            xAxes: [
              {
                gridLines: {
                  color: 'rgba(0, 0, 0, 0.1)'
                }
              }
            ]
          }
        };
      }
    }
  },

  mounted() {
    this.renderChart(this.chartData, this.options);
  }
};
</script>
