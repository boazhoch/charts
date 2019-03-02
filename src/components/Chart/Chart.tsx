import React, { Component } from "react";
const ReactHighstock = require("react-highcharts/ReactHighstock");

interface IProps {
  config: any;
  onChartInit: (chart: any) => void;
}

class Chart extends Component<IProps> {
  constructor(props: IProps) {
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
