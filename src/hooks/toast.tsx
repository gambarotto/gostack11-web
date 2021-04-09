import React, { createContext, useCallback, useContext, useState } from 'react';
// eslint-disable-next-line camelcase
import { v4 as uuid_v4 } from 'uuid';
import ToastContainer from '../components/ToastContainer';

export interface ToastMessage {
  id: string;
  type?: 'success' | 'error' | 'info';
  title: string;
  description?: string;
}

interface ToastContextData {
  // eslint-disable-next-line no-unused-vars
  addToast(message: Omit<ToastMessage, 'id'>): void;
  // eslint-disable-next-line no-unused-vars
  removeToast(id: string): void;
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData);

const ToastProvider: React.FC = ({ children }) => {
  const [messages, setMessages] = useState<ToastMessage[]>([]);
  const addToast = useCallback(
    ({ type, title, description }: Omit<ToastMessage, 'id'>) => {
      const id = uuid_v4();
      const toast = {
        id,
        type,
        title,
        description,
      };
      setMessages((oldState) => [...oldState, toast]);
    },
    [],
  );
  const removeToast = useCallback((id: string) => {
    setMessages((oldState) => oldState.filter((message) => message.id !== id));
  }, []);
  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer messages={messages} />
    </ToastContext.Provider>
  );
};
function useToast(): ToastContextData {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useAuth must be used within an ToastProvider');
  }
  return context;
}
export { ToastProvider, useToast };
