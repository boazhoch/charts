import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./components/App/App";
import * as serviceWorker from "./serviceWorker";
import "../node_modules/bulma/css/bulma.min.css";
import StockService from "./services/stock";
import Http from "./services/http";
import CONFIG from "./config";
import "bulma/css/bulma.min.css";

const http = new Http(CONFIG.STOCK_END_POINT);
const stockService = new StockService(http);

ReactDOM.render(
  <App apiService={stockService} />,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
// serviceWorker.unregister();
