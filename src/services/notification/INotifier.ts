export interface INotifier {
  info: notificationMethod;
  warning: notificationMethod;
  success: notificationMethod;
  error: notificationMethod;
}

export type notificationMethod = (text: string) => void;
