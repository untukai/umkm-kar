import React, { createContext, useState, ReactNode } from 'react';

interface Notification {
  title: string;
  message: string;
  type: 'success' | 'error';
}

interface NotificationContextType {
  showNotification: (title: string, message: string, type?: 'success' | 'error') => void;
  notification: Notification | null;
  hideNotification: () => void;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notification, setNotification] = useState<Notification | null>(null);

  const showNotification = (title: string, message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ title, message, type });
  };

  const hideNotification = () => {
    setNotification(null);
  };

  return (
    <NotificationContext.Provider value={{ showNotification, notification, hideNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};
