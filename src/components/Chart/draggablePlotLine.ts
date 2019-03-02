import debounce from "lodash/debounce";

function draggablePlotLine(axis: any) {
  let clickX: number, clickY: number;

  function getThresholdLine() {
    return axis.plotLinesAndBands[0];
  }

  const debounced: (
    onDragChange: () => void,
    new_value: number
  ) => void = debounce(
    (onDragChange: (new_value: number) => void, new_value: number) => {
      onDragChange(new_value);
    },
    300
  );

  function getValue() {
    const plotLine = getThresholdLine();
    const translation = plotLine.svgElem.translateY;
    let new_value =
      axis.toValue(translation) - axis.toValue(0) + plotLine.options.value;
    new_value = Math.max(axis.min, Math.min(axis.max, new_value));
    return new_value;
  }

  function drag_start(e: any) {
    // Cancel zoom
    axis.chart.options.chart.zoomType = "";
    axis.chart.container.addEventListener("mousemove", drag_step);
    axis.chart.container.addEventListener("mouseup", drag_stop);

    const plotLine = getThresholdLine();

    clickX = e.pageX - plotLine.svgElem.translateX;
    clickY = e.pageY - plotLine.svgElem.translateY;
  }

  // On Threshold drag functionality, update threshold line on drag every 300ms debounce.
  function drag_step(e: any) {
    var plotLine = getThresholdLine();
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
      debounced(plotLine.options.onDragChange, new_value);
    }
  }

  // On Threshold drag functionality, update threshold line on end.
  function drag_stop() {
    axis.chart.container.removeEventListener("mousemove", drag_step);
    axis.chart.container.removeEventListener("mouseup", drag_stop);
    axis.chart.options.chart.zoomType = "xy";

    var plotLine = getThresholdLine();

    if (!plotLine) {
      return;
    }

    var plotLineOptions = plotLine.options;

    //Remove + Re-insert plot line
    //Otherwise it gets messed up when chart is resized
    if (plotLine.svgElem.hasOwnProperty("translateX")) {
      plotLineOptions.value = getValue();
      axis.removePlotLine(plotLineOptions.id);
      axis.addPlotLine(plotLineOptions);
    }

    getThresholdLine()
      .svgElem.css({ cursor: "pointer" })
      .translate(0, 0)
      .on("mousedown", drag_start);
  }

  drag_stop();
}

export { draggablePlotLine };
