export interface IApiService {
  getData(
    options: IApiDataOptions
  ): Promise<{ err?: Error; data?: IGetDataPayload }>;
}

export interface IGetDataPayload {
  data: stockData;
  name: string;
}

export type stockData = [number, number][];

enum QUERY_FUNCTIONS {
  TIME_SERIES_INTRADAY = "TIME_SERIES_INTRADAY",
  TIME_SERIES_DAILY = "TIME_SERIES_DAILY",
  TIME_SERIES_DAILY_ADJUSTED = "TIME_SERIES_DAILY_ADJUSTED",
  TIME_SERIES_WEEKLY = "TIME_SERIES_WEEKLY",
  TIME_SERIES_WEEKLY_ADJUSTED = "TIME_SERIES_WEEKLY_ADJUSTED",
  TIME_SERIES_MONTHLY = "TIME_SERIES_MONTHLY",
  TIME_SERIES_MONTHLY_ADJUSTED = "TIME_SERIES_MONTHLY_ADJUSTED"
}

enum QUERY_INTERVALS {
  "1MIN" = "1min",
  "5MIN" = "5min",
  "15MIN" = "15min",
  "30MIN" = "30min",
  "60MIN" = "60min"
}

enum QUERY_OUTPUT_SIZE {
  COMPACT = "compact",
  FULL = "full"
}

export interface IApiDataOptions {
  symbol: string;
}

export interface IStockDefaults {
  INTERVAL: QUERY_INTERVALS;
  OUTPUT_SIZE: QUERY_OUTPUT_SIZE;
  FUNCTION: QUERY_FUNCTIONS;
}

export type IPayload = {
  "Meta Data": payloadMetaData;
  "Time Series (Daily)": payloadStockDataDaily;
};

type payloadMetaData = {
  "2. Symbol": string;
};

export type payloadStockDataDaily = {
  [index: string]: payloadStockData;
};

type payloadStockData = {
  "4. close": string;
};

export { QUERY_FUNCTIONS, QUERY_INTERVALS, QUERY_OUTPUT_SIZE };
