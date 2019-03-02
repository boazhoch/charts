import { IHttp } from "../http/IHttp";
import {
  IStockQueryOptions,
  QUERY_FUNCTIONS,
  QUERY_INTERVALS,
  QUERY_OUTPUT_SIZE,
  IStockService,
  stockData
} from "./IStockService";
import { INotifier } from "../notification/INotifier";

interface IStockDefaults {
  INTERVAL: QUERY_INTERVALS;
  OUTPUT_SIZE: QUERY_OUTPUT_SIZE;
  FUNCTION: QUERY_FUNCTIONS;
}

type IPayload = {
  "Meta Data": payloadMetaData;
  "Time Series (Daily)": payloadStockDataDaily;
};

type payloadMetaData = {
  "2. Symbol": string;
};

type payloadStockDataDaily = {
  [index: string]: payloadStockData;
};

type payloadStockData = {
  "4. close": string;
};

class StockService implements IStockService {
  private requester: IHttp;
  private DEFAULTS: IStockDefaults = {
    INTERVAL: QUERY_INTERVALS["5MIN"],
    OUTPUT_SIZE: QUERY_OUTPUT_SIZE.COMPACT,
    FUNCTION: QUERY_FUNCTIONS.TIME_SERIES_DAILY
  };

  constructor(requester: IHttp) {
    this.requester = requester;
  }

  private getStockDataFromPayload(data: IPayload) {
    return data["Time Series (Daily)"];
  }

  private getStockMetaDataFromPayload(data: IPayload) {
    return data["Meta Data"];
  }

  private normalizeStockData(stockData: payloadStockDataDaily) {
    let datesAndValuesArray: stockData = [];

    for (const data in stockData) {
      const dateToTimeStamp: number = new Date(data).getTime();
      const closeValue: number = parseFloat(stockData[data]["4. close"]);

      const dateValue: [number, number] = [dateToTimeStamp, closeValue];
      datesAndValuesArray.push(dateValue);
    }

    datesAndValuesArray.reverse();

    return datesAndValuesArray;
  }

  private getSymbolName(metaData: any) {
    return metaData["2. Symbol"];
  }

  private normalizePayloadData(data: IPayload) {
    const stockData = this.getStockDataFromPayload(data);
    const metaData = this.getStockMetaDataFromPayload(data);

    return {
      data: this.normalizeStockData(stockData),
      name: this.getSymbolName(metaData)
    };
  }

  public getData(options: IStockQueryOptions) {
    return this.requester
      .get(this.constructQuery(options))
      .then(response => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then(result => {
        if (result.Note) {
          throw new Error("Too much api calls please try in a minute");
        }
        return { err: undefined, data: this.normalizePayloadData(result) };
      })
      .catch((err: Error) => {
        return {
          err,
          data: undefined
        };
      });
  }

  private constructQuery(options: IStockQueryOptions) {
    const functionType = this.functionQuery(options.function);
    const symbol = this.symbolQuery(options.symbol);
    const outputSize = this.outputsizeQuery(options.output);
    const interval = this.intervalQuery(options.interval);
    return `/query?${this.chainQueryOptions([
      functionType,
      symbol,
      outputSize,
      interval
    ])}&apikey=42ZHNDEL9LV70H59`;
  }

  private chainQueryOptions(options: string[]) {
    let queryString: string = "";

    options.forEach(option => {
      if (option) {
        queryString = !queryString ? option : `${queryString}&${option}`;
      }
    });

    return queryString;
  }

  private functionQuery(
    functionType: QUERY_FUNCTIONS = this.DEFAULTS.FUNCTION
  ) {
    return `function=${functionType}`;
  }

  private symbolQuery(symbol: string) {
    return `symbol=${symbol}`;
  }

  private intervalQuery(
    intervalType: QUERY_INTERVALS = this.DEFAULTS.INTERVAL
  ) {
    return `interval=${intervalType}`;
  }

  private outputsizeQuery(
    outputType: QUERY_OUTPUT_SIZE = this.DEFAULTS.OUTPUT_SIZE
  ) {
    return `outputsize=${outputType}`;
  }
}

export default StockService;
