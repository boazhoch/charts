import React, { Component, Ref} from 'react';
import Highcharts from 'highcharts/highstock';
//@ts-ignore
import HighchartsReact from 'highcharts-react-official';


interface IProps {
    data?: number[][]
 };

interface IState { };

class Chart extends Component<IProps, IState> { 
    private chartRef: Ref<HighchartsReact>;
    constructor(props: IProps) { 
        super(props);
        this.chartRef = React.createRef();
    }

    state = {
        chart: {
            zoomType: 'xy'
        },
        options: {
            title: {
                text: 'Stock chart'
            },
            yAxis: {
                title: {
                    text: 'Exchange rate'
                },
                plotLines: [{
                    value: 40,
                    color: 'green',
                    dashStyle: 'shortdash',
                    width: 2,
                    label: {
                        text: 'Last quarter minimum'
                    }
                }, {
                    value: 10,
                    color: 'red',
                    dashStyle: 'shortdash',
                    width: 2,
                    label: {
                        text: 'Last quarter maximum'
                    }
                }]
            },
            series: [{
                name: 'MS',
                data: []
            }]
        }
    }

    static getDerivedStateFromProps(props: IProps, state: IState) {  
        return {
            ...state,
            options: {
                chart: {
                    // type: 'area',
                    zoomType: 'xy'
                },
                legend: {
                    enabled: false
                },
                plotOptions: {
                    area: {
                        allowPointSelect: true,
                        fillOpacity: 0.2,
                        lineWidth: 1,
                        step: 'center'
                    }
                },
                tooltip: {
                    headerFormat: '<span style="font-size=10px;">Price: {point.key}</span><br/>',
                    valueDecimals: 2
                },
                yAxis: {
                    title: {
                        text: 'Exchange rate'
                    },
                    plotLines: [{
                        value: 40,
                        color: 'green',
                        dashStyle: 'shortdash',
                        width: 2,
                        label: {
                            text: 'Threshold'
                        },
                        id: 'threshold',
                        onDragStart: function (val:any) {
                            console.log(val);
                        },
                        onDragChange: function (val: any) {
                            console.log(val);
                        },
                        onDragFinish: function (val: any) {
                            console.log(val);
                        }
                    }]
                },
                series: [
                    {
                        name: 'MS',
                        data: props.data
                    }
                ]
            }
         }
    }

    componentDidMount() { 
        // const chart = this.chartRef && this.chartRef.current.chart;
        console.log(this.chartRef);
    }

    onDataChange(data: number[][]) { 
        this.setState({ options: { ...this.state.options, series: [{name: 'MS', data }]}})
    }

    render() {
        return <HighchartsReact
            highcharts={Highcharts}
            ref={this.chartRef}
            constructorType={'stockChart'}
            options={this.state.options}
            callback={(chart:any) => { console.log(chart) }}
        />
    }
}

export default Chart;

