
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Notification } from '../types';
import { Icon } from '../components/Icon';
import { timeAgo } from '../utils';

const NotificationItem: React.FC<{ notification: Notification }> = ({ notification }) => {
    const iconMap: Record<Notification['type'], 'star' | 'fork' | 'info'> = {
        star: 'star',
        fork: 'fork',
        issue: 'info',
    };

    return (
        <div className={`p-4 flex items-start gap-4 border-b border-gh-dark-border last:border-b-0 ${!notification.read ? 'bg-gh-dark-secondary/50' : ''}`}>
            {!notification.read && <Icon name="dot-fill" className="text-gh-blue mt-1.5 h-4 w-4 flex-shrink-0" />}
            <Icon name={iconMap[notification.type]} className="text-gh-dark-text-secondary mt-1.5 flex-shrink-0 h-4 w-4" />
            <div className='w-full'>
                <p className="text-gh-dark-text">{notification.title}</p>
                <div className="text-xs text-gh-dark-text-secondary flex items-center gap-2 mt-1">
                    <img src={notification.actor.avatarUrl} alt={notification.actor.username} className="w-4 h-4 rounded-full"/>
                    <span>by <strong>{notification.actor.username}</strong> in <strong>{notification.repoName}</strong></span>
                    <span>&middot;</span>
                    <span>{timeAgo(notification.timestamp)}</span>
                </div>
            </div>
            <input type="checkbox" className="form-checkbox h-4 w-4 bg-gh-dark border-gh-dark-border rounded text-gh-blue focus:ring-gh-blue ml-auto" />
        </div>
    );
}

const NotificationsPage: React.FC = () => {
    const { notifications } = useAppContext();
    const unreadCount = notifications.filter(n => !n.read).length;
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Notifications</h1>
                <button className="text-sm text-gh-blue hover:underline" disabled={unreadCount === 0}>Mark all as read</button>
            </div>
            <div className="border border-gh-dark-border rounded-md">
                {notifications.length > 0 ? (
                    notifications.map(n => <NotificationItem key={n.id} notification={n}/>)
                ) : (
                    <p className="p-8 text-center text-gh-dark-text-secondary">You have no new notifications.</p>
                )}
            </div>
        </div>
    );
}

export default NotificationsPage;
