import { IHttp } from "../http/IHttp";
import {
  IStockQueryOptions,
  QUERY_FUNCTIONS,
  QUERY_INTERVALS,
  QUERY_OUTPUT_SIZE,
  IStockService
} from "./IStockService";

interface IStockDefaults {
  INTERVAL: QUERY_INTERVALS;
  OUTPUT_SIZE: QUERY_OUTPUT_SIZE;
  FUNCTION: QUERY_FUNCTIONS;
}

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

  public async getStock(options: IStockQueryOptions) {
    // TODO: handle error and timeouts.
    const result = await this.requester.get(this.constructQuery(options));
    const payload = await result.json();
    const data = payload["Time Series (Daily)"];
    let datesAndValuesArray = [];
    for (const date in data) {
      const dateToTimeStamp: number = new Date(date).getTime();
      const closeValue: number = parseFloat(data[date]["4. close"]);

      const dateValue = [dateToTimeStamp, closeValue];
      datesAndValuesArray.push(dateValue);
    }

    datesAndValuesArray.reverse();

    return datesAndValuesArray;
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
