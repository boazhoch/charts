import StockService from ".";
import { IApiService } from "./IStockService";
import Http from "../http";

jest.mock('../http')

describe('StockService', () => {
    let instance: IApiService;

    beforeEach(() => {
        instance = new StockService(new Http('mock end point'));
    });

    it('should get data from stock api', async () => {
        expect(instance).toBeInstanceOf(StockService);
        const payload = await instance.getData({ symbol: 'ms' });
        expect(payload.err).toBeFalsy();
    });

    it('should get receive an error', async () => {
        Http.prototype.get = jest.fn().mockImplementationOnce(() => {
            return Promise.reject(new Error('Something weird happened'));
        });
        const payload = await instance.getData({ symbol: 'ms' });
        expect(payload.err).toBeInstanceOf(Error);
        expect(payload.data).toBeFalsy();
    });

    it('should get receive an error', async () => {
        Http.prototype.get = jest.fn().mockImplementationOnce(() => {
            return Promise.resolve({ ok: true, json: () => ({ Note: 'Too many api calls.'})});
        });
        const payload = await instance.getData({ symbol: 'ms' });
        expect(payload.err).toThrowError('')
        expect(payload.data).toBeFalsy();
    });
});