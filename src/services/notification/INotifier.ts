export interface INotifier {
  info: notificationMethod;
  warning: notificationMethod;
  success: notificationMethod;
  error: notificationMethod;
}

export interface INotifierConstructor {
  new(): INotifier;
}

export type notificationMethod = (text: string) => void;
