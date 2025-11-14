import React, { useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon } from './Icons';

interface NotificationPopupProps {
  notification: {
    title: string;
    message: string;
    type: 'success' | 'error';
  };
  onClose: () => void;
  duration?: number;
}

const NotificationPopup: React.FC<NotificationPopupProps> = ({ notification, onClose, duration = 2500 }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const icons = {
    success: <CheckCircleIcon className="w-10 h-10 sm:w-12 sm:h-12 text-green-500" />,
    error: <XCircleIcon className="w-10 h-10 sm:w-12 sm:h-12 text-red-500" />,
  };

  const iconBgColor = {
    success: 'bg-green-100',
    error: 'bg-red-100',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in-overlay">
      <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 text-center w-full max-w-sm transform animate-popup-in">
        <div className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto ${iconBgColor[notification.type]} rounded-full flex items-center justify-center`}>
          <div className="transform scale-0 animate-icon-in">
             {icons[notification.type]}
          </div>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-neutral-800 mt-4">{notification.title}</h3>
        <p className="text-neutral-600 mt-2">{notification.message}</p>
      </div>
    </div>
  );
};

export default NotificationPopup;
