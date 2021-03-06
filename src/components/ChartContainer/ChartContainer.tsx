import React, { Component } from "react";
import {
  IApiService,
  IGetDataPayload
} from "../../services/stock/IStockService";
import { INotifier } from "../../services/notification/INotifier";
import { draggablePlotLine } from "../Chart/draggablePlotLine";
import {
  DEFAULT_CHART_OPTIONS,
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
    addData: (symbol: string) => void,
    setThresholdLin: (value: string) => void
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
      type: "areaspline",
      name: data && data.name,
      negativeColor: "rgb(226, 95, 95,0.4)",
      data: data.data
    });

    this.reflowChart();

    this.initThresholdLine(data.average);
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
  private initThresholdLine(value: number) {
    if (!this.isThresholdLineExist) {
      this.updateChartThresholdValue(value);
      this.addThresholdLineToYAxis(value);
      this.isThresholdLineExist = true;
    }
  }

  private addThresholdLineToYAxis(value: number) {
    const line = this.chart .get('yAxis').addPlotLine({
      value: value,
      color: "rgba(239, 59, 59,1)",
      width: 3,
      zIndex: 10,
      dashStyle: 'LongDash',
      label: {
        text: "Threshold"
      },
      id: "threshold",
      onDragChange: (val: any) => {
        this.updateChartThresholdValue(val);
      }
    });
    draggablePlotLine(line.axis);
  }

  private updateChartThresholdValue(val: number) {
    this.chart && this.chart.update({
      plotOptions: { series: { threshold: val } }
    });
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
   * Check if data already exist, notify if it is.
   *
   * @private
   * @param {string} name
   * @returns
   * @memberof ChartContainer
   */
  private isDataExist(name: string) {
    if (this.cache.isCached(name)) {
      this.notifier.warning(
        `Please note we already have ${name} on the chart`
      );
      return true;
    }
    return false;
  }

  /**
   * The process of adding data to the chart.
   * 
   * @param {string} symbol
   * @public
   * @memberof ChartContainer
   */
  public addData = (symbol: string) => {
    if (!symbol) {
      this.notifier.warning('You must enter a stock symbol!');
      return;
    }
    
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

  public setThresholdLine = (value: string) => {
    if (!value) {
      this.notifier.warning('No value for threshold line');
    }

    let numericValue = parseInt(value);

    const yAxis = this.chart && this.chart.get('yAxis');
    const thresholdLine = yAxis && yAxis.plotLinesAndBands[0];

    if (!yAxis || !thresholdLine) {
      this.notifier.warning(`Can't set threshold value to a chart with no data, please add data.`);
      return;
    }

    const plotLineOptions = thresholdLine.options;
    plotLineOptions.value = numericValue;

    yAxis.removePlotLine('threshold');
    yAxis.addPlotLine(plotLineOptions);
    this.updateChartThresholdValue(numericValue);
  }

  
  
  
  render() {
    return this.props.renderProp(
      this.state.config,
      this.onChartInit,
      this.addData,
      this.setThresholdLine
    );
  }
}

export default ChartContainer;

