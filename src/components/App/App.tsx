import React, { Component } from "react";
import { IApiService } from "../../services/stock/IStockService";
import { INotifier } from "../../services/notification/INotifier";
import Chart from "../Chart/Chart";
import SearchBar from "../SearchBar/SearchBar";
import ChartContainer from "../ChartContainer/ChartContainer";
import Notification from "../Notification/Notification";
import Header from "../Header/Header";
import { ICache } from "../../services/cache/ICache";

interface IProps {
  apiServices: {
    [index: string]: IApiService;
  };
  notifierService: INotifier;
  cache: ICache
}

class App extends Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  render() {
    return (
      <div className="App">
        <Header />
        <Notification />
        <main>
          <section className="section">
            <div className="container has-text-centered">
              <h1 className="title">Chartim</h1>
              <h2 className="subtitle">
                A Simple app to present data in <strong>charts</strong>, have
                fun.
              </h2>
              <div className="columns is-fluid">
                <div className="column is-full">
                  <ChartContainer
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
                              submitButtonText={"Add Stock"}
                              placeholder={"Add stock by Symbol"}
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
