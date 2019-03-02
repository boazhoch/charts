import React, { Component, Suspense } from "react";
import "./App.css";
import { IStockService } from "../../services/stock/IStockService";
import Chart from "../Chart/Chart";
import NavBar from "../NavBar/NavBar";
import SearchBar from "../SearchBar/SearchBar";
import ChartContainer from "../ChartContainer/ChartContainer";
import Notification from "../Notification/Notification";
import { INotifier } from "../../services/notification/INotifier";

// //@ts-ignore
// const NotificationComponent = React.lazy(() =>
//   import("../Notification/Notification")
// );
// const ChartContainer = React.lazy(() =>
//   import("../ChartContainer/ChartContainer")
// );

interface IProps {
  apiService: IStockService;
  notifierService: INotifier;
}

class App extends Component<IProps> {
  constructor(props: IProps) {
    super(props);
  }

  render() {
    return (
      <div className="App">
        <header>
          <NavBar />
        </header>
        <main>
          <section className="section">
            <div className="container">
              <h1 className="title">Chartim</h1>
              <h2 className="subtitle">
                A Simple app to present data in <strong>charts</strong>, have
                fun
              </h2>
              <Suspense fallback={<div>Loading...</div>} />
              <Notification />
              <ChartContainer
                notifier={this.props.notifierService}
                apiService={this.props.apiService}
                renderProp={(
                  config: any,
                  onChartInit: (chart: any) => void,
                  addData: (symbol: string) => void
                ) => (
                  <>
                    <div className="columns">
                      <div className="column">
                        <SearchBar
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
          </section>
        </main>
      </div>
    );
  }
}

export default App;
