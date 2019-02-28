import React, { Component } from "react";
import "./App.css";
import Chart from "../Chart/Chart";
import { IStockService } from "../../services/stock/IStockService";

interface IProps {
  stockService: IStockService;
}

interface IState {
  data?: number[][];
}

class App extends Component<IProps, IState> {
  private stockService: IStockService;
  state = {
    data: undefined
  };

  constructor(props: IProps) {
    super(props);
    this.stockService = props.stockService;
  }

  componentDidMount() {
    this.stockService.getStock({ symbol: "MS" }).then(data => {
      this.setState({ data });
    });
  }

  render() {
    return (
      <div className="App">
        <header />
        <main>
          <Chart data={this.state.data} />
        </main>
      </div>
    );
  }
}

export default App;
