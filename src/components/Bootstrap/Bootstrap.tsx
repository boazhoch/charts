import React, { Component } from "react";
import CONFIG from "../../config";
import StockService from "../../services/stock";
import Http from "../../services/http";
import CacheService from "../../services/cache";
import CacheFactory from "../../services/CacheFactory";
import NotificationFactory from "../../services/NotificationFactory";
import Notifier from "../../services/notification";
import RequesterFactory from "../../services/RequesterFactory";
import ApiFactory from "../../services/ApiFactory";
import App from "../App/App";
import { IApiService } from "../../services/stock/IStockService";
import { INotifier } from "../../services/notification/INotifier";
import { ICache } from "../../services/cache/ICache";
//@ts-ignore
// import { IdleQueue } from "idlize/IdleQueue.mjs";

// const queue = new IdleQueue({ ensureTasksRun: true });


interface IProps {}

class Bootstrap extends Component<IProps> {
    private appProps: {
        apiServices: {
            stock: IApiService;
        };
        notifierService: INotifier;
        cache: ICache;
    }
    
    constructor(props: IProps) {
        super(props);
        const cachingFactory = new CacheFactory({ simple: CacheService });
        const notifierFactory = new NotificationFactory({ simple: Notifier })
        const requesterFactory = new RequesterFactory({ http: Http })
        const apiFactory = new ApiFactory({ stock: StockService })


        const simpleCache = cachingFactory.getService('simple');
        const notifier = notifierFactory.getService('simple');
        const stockRequester = requesterFactory.getService('http', CONFIG.STOCK_END_POINT);

        const services = {
            stock: apiFactory.getService('stock', stockRequester)
        };

        this.appProps = { apiServices: services, notifierService: notifier, cache: simpleCache }
    }

    render() {
        return <App {...this.appProps}  />
    }
}

export default Bootstrap;