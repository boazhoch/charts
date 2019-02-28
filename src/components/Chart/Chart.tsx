import React, { Component } from "react";
import debounce from "lodash/debounce";
const ReactHighstock = require("react-highcharts/ReactHighstock");

interface IProps {
  data?: number[][];
}

interface IState {}

function draggablePlotLine(axis: any, plotLineId: any) {
  var clickX: any, clickY: any;

  var getPlotLine = function() {
    for (var i = 0; i < axis.plotLinesAndBands.length; i++) {
      if (axis.plotLinesAndBands[i].id === plotLineId) {
        return axis.plotLinesAndBands[i];
      }
    }
  };

  const d: (onDragChange: any, new_value: any, chart: any) => void = debounce(
    (onDragChange: any, new_value: any, chart: any) => {
      onDragChange(new_value, chart);
    },
    300
  );

  var getValue = function() {
    var plotLine = getPlotLine();
    var translation = axis.horiz
      ? plotLine.svgElem.translateX
      : plotLine.svgElem.translateY;
    var new_value =
      axis.toValue(translation) - axis.toValue(0) + plotLine.options.value;
    new_value = Math.max(axis.min, Math.min(axis.max, new_value));
    return new_value;
  };

  var drag_start = function(e: any) {
    axis.chart.options.chart.zoomType = "";
    axis.chart.container.addEventListener("mousemove", drag_step);
    axis.chart.container.addEventListener("mouseup", drag_stop);

    var plotLine = getPlotLine();
    clickX = e.pageX - plotLine.svgElem.translateX;
    clickY = e.pageY - plotLine.svgElem.translateY;
    if (plotLine.options.onDragStart) {
      plotLine.options.onDragStart(getValue());
    }
  };

  var drag_step = function(e: any) {
    var plotLine = getPlotLine();
    var new_translation = axis.horiz ? e.pageX - clickX : e.pageY - clickY;
    var new_value =
      axis.toValue(new_translation) - axis.toValue(0) + plotLine.options.value;
    new_value = Math.max(axis.min, Math.min(axis.max, new_value));
    new_translation = axis.toPixels(
      new_value + axis.toValue(0) - plotLine.options.value
    );
    plotLine.svgElem.translate(
      axis.horiz ? new_translation : 0,
      axis.horiz ? 0 : new_translation
    );

    if (plotLine.options.onDragChange) {
      d(plotLine.options.onDragChange, new_value, axis.chart);
    }
  };

  var drag_stop = function() {
    axis.chart.container.removeEventListener("mousemove", drag_step);
    axis.chart.container.removeEventListener("mouseup", drag_stop);
    axis.chart.options.chart.zoomType = "xy";

    var plotLine = getPlotLine();
    var plotLineOptions = plotLine.options;
    //Remove + Re-insert plot line
    //Otherwise it gets messed up when chart is resized
    if (plotLine.svgElem.hasOwnProperty("translateX")) {
      plotLineOptions.value = getValue();
      axis.removePlotLine(plotLineOptions.id);
      axis.addPlotLine(plotLineOptions);

      if (plotLineOptions.onDragFinish) {
        plotLineOptions.onDragFinish(plotLineOptions.value, axis.chart);
      }
    }

    getPlotLine()
      .svgElem.css({ cursor: "pointer" })
      .translate(0, 0)
      .on("mousedown", drag_start);
  };
  drag_stop();
}

class Chart extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  state = {
    options: {
      chart: {
        // type: 'area',
        zoomType: "xy"
      },
      legend: {
        enabled: false
      },
      plotOptions: {
        area: {
          allowPointSelect: true,
          fillOpacity: 0.2,
          lineWidth: 1,
          step: "center"
        }
      },
      yAxis: {
        title: {
          text: "Exchange rate"
        },
        plotLines: [
          {
            value: 40,
            color: "green",

            width: 2,
            zIndex: 10,

            label: {
              text: "Threshold"
            },
            id: "threshold",
            dashStyle: "Solid",
            onDragStart: function(val: any) {
              console.log(val);
            },
            onDragChange: function(val: any) {
              console.log(val);
            },
            onDragFinish: function(val: any) {
              console.log(val);
            }
          }
        ]
      }
    }
  };

  static getDerivedStateFromProps(props: IProps, state: IState) {
    return {
      ...state,
      options: {
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
            threshold: 40
          }
        },
        yAxis: {
          title: {
            text: "Exchange rate"
          },
          plotLines: [
            {
              value: 40,
              color: "green",
              width: 3,
              zIndex: 10,
              label: {
                text: "Threshold"
              },
              id: "threshold",
              onDragStart: function(val: any) {
                console.log(val);
              },
              onDragChange: function(val: any, chart: any) {
                chart.update({
                  plotOptions: { series: { threshold: val } }
                });
              },
              onDragFinish: (val: any, chart: any) => {}
            }
          ]
        },
        series: [
          {
            type: "spline",
            name: "MS",
            color: "#FF0000",
            negativeColor: "#0088FF",
            data: props.data
          }
        ]
      }
    };
  }

  onDataChange(data: number[][]) {
    this.setState({
      options: { ...this.state.options, series: [{ name: "MS", data }] }
    });
  }

  render() {
    return (
      <ReactHighstock
        config={this.state.options}
        callback={(chart: any) => {
          console.log(chart);
          draggablePlotLine(chart.yAxis[0], "threshold");
        }}
      />
    );
  }
}

export default Chart;
