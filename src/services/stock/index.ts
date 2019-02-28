import { IHttp } from "../http/IHttp";
import { IStockQueryOptions, QUERY_FUNCTIONS, QUERY_INTERVALS, QUERY_OUTPUT_SIZE, IStockService } from "./IStockService";

class StockService implements IStockService { 
    private requester: IHttp;
    constructor(requester: IHttp) { 
        this.requester = requester;
    }

    async getStock(options: IStockQueryOptions) {
        const result = await this.requester.get(this.constructQuery(options));
        const payload = await result.json();
        const data = payload["Time Series (Daily)"];
        let datesAndValuesArray = [];
        for (const date in data) {
            const dateToTimeStamp: number = new Date(date).getTime();
            const closeValue: number = parseFloat(data[date]['4. close']);

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
        return `/query?${this.chainQueryOptions([functionType, symbol, outputSize, interval])}&apikey=42ZHNDEL9LV70H59`;
    }

    private chainQueryOptions(options: string[]) { 
        let queryString: string = '';

        options.forEach((option) => {
            if (option) {
                queryString = !queryString ? option : `${queryString}&${option}`;
            }
        });

        return queryString;
    }

    private functionQuery(functionType?: QUERY_FUNCTIONS) { 
        return `function=${functionType || QUERY_FUNCTIONS.TIME_SERIES_DAILY}`;
    }

    private symbolQuery(symbol: string) {
        return `symbol=${symbol}`;
    }

    private intervalQuery(intervalType?: QUERY_INTERVALS) {
        return `interval=${intervalType || QUERY_INTERVALS["5MIN"]}`;
    }

    private outputsizeQuery(outputType?: QUERY_OUTPUT_SIZE) {
        return `outputsize=${outputType || QUERY_OUTPUT_SIZE.COMPACT}`;
    }
}

export default StockService;