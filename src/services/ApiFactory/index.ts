import { IApiServiceConstructor, IApiService } from "../stock/IStockService";
import { IHttp } from "../http/IHttp";

class ApiFactory implements IFactory {
    private requesters: Map<string, IApiServiceConstructor> = new Map<string, IApiServiceConstructor>();
    constructor(requesterTypes: { [index: string]: IApiServiceConstructor }) {
        for (const requesterName in requesterTypes) {
            this.requesters.set(requesterName, requesterTypes[requesterName])
        }
    }

    public getService(name: string, requester: IHttp): IApiService {
        const RequesterService = this.requesters.get(name);
        return new (RequesterService as IApiServiceConstructor)(requester);
    }
}

interface IFactory {
    getService(name: string, requester: IHttp): IApiService;
}

export default ApiFactory;