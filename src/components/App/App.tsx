import React, { Component } from "react";

import Notification from "../Notification/Notification";
import Header from "../Header/Header";
import './App.css';

import { IApiService } from "../../services/stock/IStockService";
import { INotifier } from "../../services/notification/INotifier";
import { ICache } from "../../services/cache/ICache";
import { IChartContainerProps } from "../ChartContainer/ChartContainer";
import { IChartProps } from "../Chart/Chart";
import { ISearchBarProps } from "../SearchBar/SearchBar";

interface IProps {
  apiServices?: {
    [index: string]: IApiService;
  };
  notifierService?: INotifier;
  cache?: ICache;
  queuer?: any
}

interface IState {
  ChartContainer: null | React.ComponentType<IChartContainerProps>;
  Chart: null |React.ComponentType<IChartProps>;
  SearchBar: null | React.ComponentType<ISearchBarProps>;
}

class App extends Component<IProps, IState> {
  private mounted?: boolean;
  constructor(props: IProps) {
    super(props);

    this.state = {
      ChartContainer: null,
      Chart: null,
      SearchBar: null
    }
  }

  componentDidMount() {
    this.mounted = true;
    
    const loadComponents = () => {
      this.loadComponents().then(modules => {
        const [ChartContainer, SearchBar, Chart] = modules;
        this.mounted && this.setState({
          ChartContainer: ChartContainer.default,
          SearchBar: SearchBar.default,
          Chart: Chart.default
        })
      }).catch((err: Error) => {
        this.props.notifierService && this.props.notifierService.error(err.message);
      })
    }
    
    if (this.props.queuer) {
      this.props.queuer.pushTask(() => {
        loadComponents();
      })
    }
    else {
      loadComponents();
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  private loadComponents() {
    const ChartModule = import('../Chart/Chart')
    const SearchBarModule = import('../SearchBar/SearchBar')
    const ChartContainerModule = import('../ChartContainer/ChartContainer')

    return Promise.all([ChartContainerModule, SearchBarModule, ChartModule]).then(modules => {
      return modules;
    }).catch(err => {
      console.log(err);
      throw new Error('Loading modules failed please refresh app');
    })
  }

  renderChart() {
    const { ChartContainer, Chart, SearchBar } = this.state;
    if (this.props.cache && this.props.apiServices && this.props.notifierService && ChartContainer && Chart && SearchBar) {
      return <ChartContainer
        cache={this.props.cache}
        notifier={this.props.notifierService}
        apiService={this.props.apiServices["stock"]}
        renderProp={(
          config: any,
          onChartInit: (chart: any) => void,
          addData: (symbol: string) => void
        ) => (
            <>
              <div className="columns">
                <div className="column">
                  <SearchBar
                    submitButtonText={"Add stock"}
                    placeholder={"Add stock by symbol ( try 'ms' if you want to add microsoft 😉)"}
                    name={"Symbol"}
                    type={"text"}
                    onSubmit={(data: { [index: string]: string }) => {
                      addData(data.Symbol);
                    }}
                  />
                </div>
              </div>
              <div className="columns">
                <div className="column is-full">
                  <Chart config={config} onChartInit={onChartInit} />
                </div>
              </div>
            </>
          )}
      />
    }
    return <h5>Loading Please wait</h5>
  }

  render() {
    return (
      <div className="App">
        <Header />
        <Notification />
        <main>
          <section className="section">
            <div className="container has-text-centered">
              <h1 className="title">Chartim.</h1>
              <h2 className="subtitle">
                A Simple app to present data in <strong>charts</strong>, have
                fun.
              </h2>
              <div className="columns is-fluid">
                <div className="column is-full">
                  {this.renderChart()}
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }
}

export default App;
