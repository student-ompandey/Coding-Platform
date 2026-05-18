import { useEffect, useRef } from 'react';
import { notificationService } from '@/services/notificationService';
import { toast } from 'sonner';

export function NotificationListener() {
  const lastNotificationIdRef = useRef(null);

  useEffect(() => {
    // Check local storage for the last seen notification on mount
    const storedLastId = localStorage.getItem('lastNotificationId');
    if (storedLastId) {
      lastNotificationIdRef.current = storedLastId;
    }

    const fetchLatestNotifications = async () => {
      try {
        const res = await notificationService.getAll();
        const notifications = res.data;

        if (notifications && notifications.length > 0) {
          // Notifications are typically returned newest first from the backend. 
          // We will find the latest one or the ones we haven't seen.
          
          // For simplicity, let's just check the very first one if it's new
          const latestNotification = notifications[0];
          
          if (latestNotification._id !== lastNotificationIdRef.current) {
            // It's a new notification!
            // Show toast based on priority
            const title = latestNotification.title || "New Announcement";
            const message = latestNotification.message;
            const priority = latestNotification.priority;

            if (priority === 'urgent') {
              toast.error(`${title}: ${message}`, { duration: 10000 });
            } else if (priority === 'warning') {
              toast.warning(`${title}: ${message}`, { duration: 8000 });
            } else {
              toast.info(`${title}: ${message}`, { duration: 6000 });
            }

            // Update ref and local storage
            lastNotificationIdRef.current = latestNotification._id;
            localStorage.setItem('lastNotificationId', latestNotification._id);
          }
        }
      } catch (err) {
        // Silently fail if we can't fetch notifications to avoid spamming the console
      }
    };

    // Initial fetch
    fetchLatestNotifications();

    // Poll every 15 seconds
    const intervalId = setInterval(fetchLatestNotifications, 15000);

    return () => clearInterval(intervalId);
  }, []);

  return null; // This component doesn't render anything visible
}
