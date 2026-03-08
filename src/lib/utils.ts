import { clsx, type ClassValue } from "clsx"
import { toast } from "sonner";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const showSuccessToast = (message: string) => {
  toast.success(message, {
    position: 'top-right',
  });
}

export const showErrorToast = (message: string) => {
  toast.error(message, {
    position: 'top-right',
  });
}