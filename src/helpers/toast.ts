import { toast } from "react-toastify";

export const success = (message: string) => toast.success(message);

export const info = (message: string) => toast.info(message);

export const error = (message: string) => toast.error(message);
