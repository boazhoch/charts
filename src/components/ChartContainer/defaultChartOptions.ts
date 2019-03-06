export interface IChartOptions {
  chart: {
    zoomType: string;
  };
  plotOptions: {
    area: {
      allowPointSelect: boolean;
      fillOpacity: number;
      lineWidth: number;
      step: string;
    };
    series: {
      dataLabels: {
        enabled: boolean;
      };
    };
  };
  yAxis: {};
  series: seriesObject[];
}

type seriesObject = {
  data: [] | [number, number][];
  type?: string;
  id?: string;
  name?: string;
  negativeColor?: string;
};

const DEFAULT_CHART_OPTIONS: IChartOptions = {
  chart: {
    zoomType: "xy",
  },
  plotOptions: {
    area: {
      allowPointSelect: true,
      fillOpacity: 0.2,
      lineWidth: 1,
      step: "center"
    },
    series: {
      dataLabels: {
        enabled: true
      }
    }
  },
  yAxis: {
    id:'yAxis',
    title: {
      text: "Close rate"
    }
  },
  series: [
    {
      data: []
    }
  ]
};

export { DEFAULT_CHART_OPTIONS };
