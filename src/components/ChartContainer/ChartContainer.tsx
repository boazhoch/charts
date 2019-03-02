import React, { Component, Ref, RefObject } from "react";
import {
  IStockService,
  IGetDataPayload
} from "../../services/stock/IStockService";
import { draggablePlotLine } from "../Chart/draggablePlotLine";

interface IProps {
  apiService: IStockService;
  renderProp: (
    config: any,
    ref: RefObject<any>,
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
  private chartRef: RefObject<any>;
  private chart: any;
  private isThresholdLineExist = false;

  constructor(props: IProps) {
    super(props);
    this.apiService = props.apiService;
    this.chartRef = React.createRef();
  }

  state = {
    data: undefined,
    threshold: THRESHOLD_DEFAULT_VALUE,
    config: DEFAULT_CHART_OPTIONS
  };

  componentDidMount() {
    const ref = this.chartRef;
    if (ref) {
      this.chart = ref.current.getChart();
    }
  }

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

  public addData = async (symbol: string) => {
    const data = await this.getData(symbol);
    this.addSeries(data);
  };

  render() {
    return this.props.renderProp(
      this.state.config,
      this.chartRef,
      this.addData
    );
  }
}

export default ChartContainer;
