import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./components/App/App";
import * as serviceWorker from "./serviceWorker";
import "../node_modules/bulma/css/bulma.min.css";
import StockService from "./services/stock";
import Http from "./services/http";
import CONFIG from "./config";
import CacheService from "./services/cache";
import CacheFactory from "./services/CacheFactory";
import NotificationFactory from "./services/NotificationFactory";
import Notifier from "./services/notification";
import RequesterFactory from "./services/RequesterFactory";
import ApiFactory from "./services/ApiFactory";
// //@ts-ignore
// import { IdleQueue } from "idlize/IdleQueue.mjs";

// const queue = new IdleQueue({ ensureTasksRun: true });
// queue.pushTask(() => {
//   //@ts-ignore
//   import("bulma/css/bulma.min.css");
// });

const cachingFactory = new CacheFactory({ simple: CacheService });
const notifierFactory = new NotificationFactory({ simple: Notifier })
const requesterFactory = new RequesterFactory({http: Http})

const simpleCache = cachingFactory.getService('simple');
const notifier = notifierFactory.getService('simple');
const stockRequester = requesterFactory.getService('http', CONFIG.STOCK_END_POINT);
const apiFactory = new ApiFactory({stock: StockService })

const services = {
  stock: apiFactory.getService('stock', stockRequester)
};

ReactDOM.render(
  <App apiServices={services} notifierService={notifier} cache={simpleCache} />,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
// serviceWorker.unregister();
