import React, { Component, RefObject } from "react";
import "./App.css";
import { IStockService } from "../../services/stock/IStockService";
import ChartContainer from "../ChartContainer/ChartContainer";
import Chart from "../Chart/Chart";
import NavBar from "../NavBar/NavBar";
import SearchBar from "../SearchBar/SearchBar";

interface IProps {
  apiService: IStockService;
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
              <ChartContainer
                apiService={this.props.apiService}
                renderProp={(
                  config: any,
                  ref: RefObject<any>,
                  addData: (symbol: string) => void
                ) => (
                  <>
                    <div className="columns">
                      <div className="column is-full">
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
                        <Chart config={config} chartRef={ref} />
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
