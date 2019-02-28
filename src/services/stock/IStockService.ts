export interface IStockService {
    getStock(options: IStockQueryOptions): Promise<number[][]>;
}

enum QUERY_FUNCTIONS {
    TIME_SERIES_INTRADAY = 'TIME_SERIES_INTRADAY',
    TIME_SERIES_DAILY = 'TIME_SERIES_DAILY',
    TIME_SERIES_DAILY_ADJUSTED = 'TIME_SERIES_DAILY_ADJUSTED',
    TIME_SERIES_WEEKLY = 'TIME_SERIES_WEEKLY',
    TIME_SERIES_WEEKLY_ADJUSTED = 'TIME_SERIES_WEEKLY_ADJUSTED',
    TIME_SERIES_MONTHLY = 'TIME_SERIES_MONTHLY',
    TIME_SERIES_MONTHLY_ADJUSTED = 'TIME_SERIES_MONTHLY_ADJUSTED'
}

enum QUERY_INTERVALS {
    '1MIN' = '1min',
    '5MIN' = '5min',
    '15MIN' = '15min',
    '30MIN' = '30min',
    '60MIN' = '60min'
}

enum QUERY_OUTPUT_SIZE {
    COMPACT = 'compact',
    FULL = 'full'
}

export interface IStockQueryOptions {
    function?: QUERY_FUNCTIONS;
    interval?: QUERY_INTERVALS;
    output?: QUERY_OUTPUT_SIZE;
    symbol: string;
}

export { QUERY_FUNCTIONS, QUERY_INTERVALS, QUERY_OUTPUT_SIZE };