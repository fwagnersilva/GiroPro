import { useToast } from "../contexts/ToastContext";

export const showErrorToast = (message: string) => {
  const { showToast } = useToast();
  showToast(message, "error");
};



