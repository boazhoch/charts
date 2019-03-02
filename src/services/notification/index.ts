import { toast } from "react-toastify";
import { INotifier } from "./INotifier";

class Notifier implements INotifier {
  info(text: string) {
    toast.info(text);
  }

  warning(text: string) {
    toast.warn(text);
  }

  success(text: string) {
    toast.success(text);
  }

  error(text: string) {
    toast.error(text);
  }
}

export default Notifier;
