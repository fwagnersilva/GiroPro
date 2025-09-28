import { useToast } from "../contexts/ToastContext";

export const showErrorToast = (message: string) => {
  const { showToast } = useToast();
  showToast(message, "error");
};





export const showSuccessToast = (message: string) => {
  const { showToast } = useToast();
  showToast(message, "success");
};
