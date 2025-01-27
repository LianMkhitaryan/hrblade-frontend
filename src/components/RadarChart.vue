<script>
import { Radar, mixins } from 'vue-chartjs';
const { reactiveProp } = mixins;

export default {
  extends: Radar,

  mixins: [reactiveProp],

  name: 'RadarChart',

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
          scale: {
            ticks: {
              beginAtZero: true,
              display: false
            }
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
