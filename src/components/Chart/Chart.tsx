import React, { Component } from "react";
import "./chart.css";
const ReactHighstock = require("react-highcharts/ReactHighstock");
export interface IChartProps {
  config: any;
  onChartInit: (chart: any) => void;
}

class Chart extends Component<IChartProps> {
  constructor(props: IChartProps) {
    super(props);
  }

  render() {
    return (
      <ReactHighstock
        config={this.props.config}
        callback={(chart: any) => {
          this.props.onChartInit(chart);
        }}
      />
    );
  }
}

export default Chart;
