"use client";

import { Toaster } from "@/components/ui/sonner";
import { createContext, ReactNode, useContext } from "react";
import { toast } from "sonner";

type ToastType = "success" | "info" | "warning" | "error";
type ToastContextType = {
  showToast: (type: ToastType, message: string, description?: string) => void;
}

// Context Object with a default value
const ToastContext = createContext<ToastContextType | undefined>(undefined);

/**
 * Provides a toast notification system to its children
 */
export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const showToast = (type: ToastType, message: string, description?: string) => {
    const options = { description };

    switch (type) {
      case 'success':
        toast.success(message, options);
        break;
      case 'info':
        toast.info(message, options);
        break;
      case 'warning':
        toast.warning(message, options);
        break;
      case 'error':
        toast.error(message, options);
        break;
      default:
        toast(message, options);
    }
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toaster
        richColors
        closeButton
        position="top-center"
      />
    </ToastContext.Provider>
  );
}

/**
 * Custom hook to acces the toast context.
 * @returns The toast context
 * @throws {Error} If used outside of a ToastProvider.
 */
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};