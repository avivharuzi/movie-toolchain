import { createContext, PropsWithChildren, useContext, useState } from 'react';

type ToastVariant = 'error';

type ToastAnimation = 'animate-fade-in' | 'animate-fade-out';

interface Toast {
  id: number;
  message: string;
  type: ToastVariant;
  animation: ToastAnimation;
}

interface ToastContextProps {
  showToast: (message: string, type: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextProps | null>(null);

let idCounter = 0;

export const ToastProvider = ({ children }: PropsWithChildren) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: ToastVariant) => {
    const id = idCounter++;

    const toast: Toast = { id, message, type, animation: 'animate-fade-in' };

    setToasts((toasts) => [...toasts, toast]);

    setTimeout(() => {
      closeToast(id);
    }, 4500);
  };

  const closeToast = (id: number) => {
    setToasts((toasts) =>
      toasts.map((toast) => {
        if (toast.id === id) {
          return {
            ...toast,
            animation: 'animate-fade-out',
          };
        }

        return toast;
      })
    );

    setTimeout(() => {
      setToasts((toasts) => toasts.filter((toast) => toast.id !== id));
    }, 500);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        className={
          'toast-container position-fixed top-0 start-50 translate-middle-x p-3'
        }
      >
        {toasts.length > 0 && (
          <div className={'toast-container position-static'}>
            {toasts.map((toast) => (
              <div
                key={toast.id}
                className={`toast show align-items-center text-bg-danger border-0 ${toast.animation}`}
              >
                <div className={'d-flex'}>
                  <div className={'toast-body'}>{toast.message}</div>
                  <button
                    onClick={() => closeToast(toast.id)}
                    type={'button'}
                    className={'btn-close btn-close-white me-2 m-auto'}
                  ></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
};
