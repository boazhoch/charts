import React from 'react';
import { cleanup, render, waitForElement } from 'react-testing-library';
import App from './App';
import CacheFactory from '../../services/CacheFactory';
import StockService from '../../services/stock';
import ApiFactory from '../../services/ApiFactory';
import CacheService from '../../services/cache';
import NotificationFactory from '../../services/NotificationFactory';
import Notifier from '../../services/notification';
import RequesterFactory from '../../services/RequesterFactory';
import Http from '../../services/http';
import CONFIG from '../../config';


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

const appProps = { apiServices: services, notifierService: notifier, cache: simpleCache }

afterEach(cleanup)

test('Render App component', async () => {
  const a = render(<App {...appProps} />);
  const chart = await waitForElement(() => a.getByText('Add stock'))
  expect(chart).toBeTruthy();
})
