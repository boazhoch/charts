import React, { Component, RefObject } from "react";
import {
  IStockService,
  IGetDataPayload
} from "../../services/stock/IStockService";
import { draggablePlotLine } from "../Chart/draggablePlotLine";
import { INotifier } from "../../services/notification/INotifier";

interface IProps {
  apiService: IStockService;
  notifier: INotifier;
  renderProp: (
    config: any,
    onChartInit: (chart: any) => void,
    addData: (symbol: string) => void
  ) => JSX.Element;
}

interface IState {
  data?: IGetDataPayload;
}

interface IProps {}

const THRESHOLD_DEFAULT_VALUE = 10;

const DEFAULT_CHART_OPTIONS = {
  chart: {
    zoomType: "xy"
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
      },
      threshold: THRESHOLD_DEFAULT_VALUE
    }
  },
  yAxis: {
    min: 0,
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

class ChartContainer extends Component<IProps, IState> {
  private apiService: IStockService;
  private notifier: INotifier;
  private chart: any;
  private isThresholdLineExist = false;

  constructor(props: IProps) {
    super(props);
    this.apiService = props.apiService;
    this.notifier = props.notifier;
  }

  state = {
    data: undefined,
    threshold: THRESHOLD_DEFAULT_VALUE,
    config: DEFAULT_CHART_OPTIONS
  };

  private onChartInit = (chart: any) => {
    this.chart = chart;

    // Needed to relfow chart to fit container size
    // This is pretty ugly but it's a known issue in highcharts
    setTimeout(() => {
      requestAnimationFrame(() => {
        chart.reflow();
      });
    }, 30);
  };

  private addSeries(data: IGetDataPayload) {
    this.chart.addSeries({
      id: data.name,
      type: "spline",
      name: data && data.name,
      negativeColor: "#AAA",
      data: data.data
    });

    this.initThresholdLine();
  }

  private initThresholdLine() {
    if (!this.isThresholdLineExist) {
      const line = this.chart.yAxis[0].addPlotLine({
        value: THRESHOLD_DEFAULT_VALUE,
        color: "#f4df41",
        width: 3,
        zIndex: 10,
        label: {
          text: "Threshold"
        },
        id: "threshold",
        onDragChange: (val: any) => {
          this.chart.update({
            plotOptions: { series: { threshold: val } }
          });
        }
      });
      draggablePlotLine(line.axis);
      this.isThresholdLineExist = true;
    }
  }

  private async getData(symbol: string) {
    const data = await this.apiService.getData({ symbol });
    return data;
  }

  public addData = (symbol: string) => {
    const onSuccess = (name: string) => {
      this.notifier.success(
        `Uou just added: ${name} to the chart, congarts! 🦄`
      );
    };

    const onError = (err: Error) => {
      this.notifier.error(err.message);
    };

    this.getData(symbol)
      .then(result => {
        if (result.err) {
          throw result.err;
        }
        return result.data;
      })
      .then(data => {
        if (data) {
          this.addSeries(data);
          onSuccess(data.name);
        }
      })
      .catch(onError);
  };

  render() {
    return this.props.renderProp(
      this.state.config,
      this.onChartInit,
      this.addData
    );
  }
}

export default ChartContainer;
