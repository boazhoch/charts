import React, { Component, RefObject } from "react";
const ReactHighstock = require("react-highcharts/ReactHighstock");

interface IProps {
  config: any;
  chartRef: RefObject<any>;
}

class Chart extends Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  render() {
    return (
      <ReactHighstock ref={this.props.chartRef} config={this.props.config} />
    );
  }
}

export default Chart;
