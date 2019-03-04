import React, { Component } from "react";
import {
  IApiService,
  IGetDataPayload
} from "../../services/stock/IStockService";
import { INotifier } from "../../services/notification/INotifier";
import { draggablePlotLine } from "../Chart/draggablePlotLine";
import {
  DEFAULT_CHART_OPTIONS,
  THRESHOLD_DEFAULT_VALUE,
  IChartOptions
} from "./defaultChartOptions";
import cloneDeep from "lodash/cloneDeep";
import { ICache } from "../../services/cache/ICache";

export interface IChartContainerProps {
  apiService: IApiService;
  notifier: INotifier;
  renderProp: (
    config: any,
    onChartInit: (chart: any) => void,
    addData: (symbol: string) => void
  ) => JSX.Element;
  cache: ICache;
}

interface IState {
  config: IChartOptions;
}


class ChartContainer extends Component<IChartContainerProps, IState> {
  private apiService: IApiService;
  private notifier: INotifier;
  // chart -> highcharts chart.
  private chart: any;
  private isThresholdLineExist = false;
  private reflowed = false;
  private cache: ICache;

  constructor(props: IChartContainerProps) {
    super(props);
    this.cache = props.cache;
    this.apiService = props.apiService;
    this.notifier = props.notifier;
  }

  state = {
    config: cloneDeep(DEFAULT_CHART_OPTIONS)
  };

  // callback method after chart initialization 
  private onChartInit = (chart: any) => {
    this.chart = chart;
  };

  /**
   * Add data to the chart.
   * Reflow chart after adding data to chart.
   * Init threshold line after adding data.
   *
   * @private
   * @param {IGetDataPayload} data
   * @memberof ChartContainer
   */
  private addSeries(data: IGetDataPayload) {
    this.chart.addSeries({
      id: data.name,
      type: "spline",
      name: data && data.name,
      negativeColor: "#AAA",
      data: data.data
    });

    this.reflowChart();

    this.initThresholdLine();
  }

  /**
   * Reflow chart only once to fix container issue take a look here:
   * https://stackoverflow.com/questions/33785708/highcharts-container-wider-than-parent-div
   *
   * @private
   * @memberof ChartContainer
   */
  private reflowChart() {
    !this.reflowed &&
      requestAnimationFrame(() => {
        this.chart.reflow();
        this.reflowed = true;
      });
  }

  /**
   * Init threshold line once adding the ability to drag.
   *
   * @private
   * @memberof ChartContainer
   */
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

  /**
   * Get data from the api service and return it.
   *
   * @private
   * @param {string} symbol
   * @returns
   * @memberof ChartContainer
   */
  private async getData(symbol: string) {
    const data = await this.apiService.getData({ symbol });
    return data;
  }

  /**
   * The process of adding data to the chart.
   * 
   * @param {string} symbol
   * @public
   * @memberof ChartContainer
   */
  public addData = (symbol: string) => {
    const onSuccess = (name: string) => {
      this.notifier.success(
        `You just added ${name} to the chart, congarts! 🦄`
      );
    };

    const onError = (err: Error) => {
      this.notifier.error(err.message);
    };

    const lowerCaseSymbol = symbol.toLowerCase()

    if (this.isDataExist(lowerCaseSymbol)) {
      return;
    }

    this.notifier.info(
      `Hey we are retrieving your data
      this may take a while, please wait...
      `)

    this.getData(lowerCaseSymbol)
      .then(result => {
        if (result.err) {
          throw result.err;
        }
        return result.data;
      })
      .then(data => {
        if (data) {
          this.addSeries(data);
          this.cache.addToCache(data.name);
          onSuccess(data.name);
        }
      })
      .catch(onError);
  };

  /**
   * Check if data already exist, notify if it is.
   *
   * @private
   * @param {string} name
   * @returns
   * @memberof ChartContainer
   */
  private isDataExist(name:string) { 
    if (this.cache.isCached(name)) {
      this.notifier.warning(
        `Please note we already have ${name} on the chart`
      );
      return true;
    }
    return false;
  }

  render() {
    return this.props.renderProp(
      this.state.config,
      this.onChartInit,
      this.addData
    );
  }
}

export default ChartContainer;

