import { IHttp, IHttpConstructor } from "../http/IHttp";

class RequesterFactory implements IFactory {
    private requesters: Map<string, IHttpConstructor> = new Map<string, IHttpConstructor>();
    constructor(requesterTypes: { [index: string]: IHttpConstructor }) {
        for (const requesterName in requesterTypes) {
            this.requesters.set(requesterName, requesterTypes[requesterName])
        }
    }

    public getService(name: string, options: string): IHttp {
        const RequesterService = this.requesters.get(name);
        return new (RequesterService as IHttpConstructor)(options);
    }
}

interface IFactory {
    getService(name: string, options:string): IHttp;
}

export default RequesterFactory;