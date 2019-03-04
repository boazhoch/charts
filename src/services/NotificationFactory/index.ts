import { INotifier, INotifierConstructor } from "../notification/INotifier";

class NotificationFactory implements IFactory {
    private notifiers: Map<string, INotifierConstructor> = new Map<string, INotifierConstructor>();
    constructor(notifierTypes: { [index: string]: INotifierConstructor }) {
        for (const notifierName in notifierTypes) {
            this.notifiers.set(notifierName, notifierTypes[notifierName])
        }
    }

    public getService(name: string): INotifier {
        const NotifierService = this.notifiers.get(name);
        return new (NotifierService as INotifierConstructor)();
    }
}

interface IFactory {
    getService(name: string): INotifier;
}

export default NotificationFactory;