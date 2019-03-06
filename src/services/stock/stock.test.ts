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

    it('should get data receive an error', async () => {
        Http.prototype.get = jest.fn().mockImplementationOnce(() => {
            return Promise.reject(new Error('Something weird happened'));
        });
        const payload = await instance.getData({ symbol: 'ms' });
        expect(payload.err).toBeInstanceOf(Error);
        expect(payload.data).toBeFalsy();
    });

    it('should get data receive an error', async () => {
        Http.prototype.get = jest.fn().mockImplementationOnce(() => {
            return Promise.resolve({ ok: false, json: () => new Error('error')});
        });
        const payload = await instance.getData({ symbol: 'ms' });
        expect(payload.err).toBeInstanceOf(Error);
        expect(payload.data).toBeFalsy();
        expect(payload.err && payload.err.message).toBe('Something went really bad, we are sorry.')
    });

    it('should get data receive an error for too many api calls', async () => {
        Http.prototype.get = jest.fn().mockImplementationOnce(() => {
            return Promise.resolve({ ok: true, json: () => ({ Note: 'Too many api calls.'})});
        });
        const payload = await instance.getData({ symbol: 'ms' });
        if (payload.err) {
            expect(payload.err.message).toBe('Too many api calls, please wait a minute.')
        }
        expect(payload.data).toBeFalsy();
    });

    it('should get data receive an error for searching a non existing symbol', async () => {
        Http.prototype.get = jest.fn().mockImplementationOnce(() => {
            return Promise.resolve({ ok: true, json: () => ({ 'Error Message': 'symbol not found' }) });
        });
        const payload = await instance.getData({ symbol: 'gogggggggg' });
        if (payload.err) {
            expect(payload.err.message).toBe('This symbol does not exist.')
        }
        expect(payload.data).toBeFalsy();
    });
});