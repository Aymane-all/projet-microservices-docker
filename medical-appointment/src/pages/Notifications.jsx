// src/pages/Notifications.jsx
import React, { useState } from 'react';
import './Notifications.css';  // To style the notifications

const Notifications = () => {
    // Static list of notifications
    const [notifications, setNotifications] = useState([
        { id: 1, type: 'appointment', message: 'You have a new appointment tomorrow at 3 PM', timestamp: '2025-04-18 12:30', read: false },
        { id: 2, type: 'message', message: 'New message from Dr. Smith regarding your appointment', timestamp: '2025-04-18 11:00', read: false },
        { id: 3, type: 'reminder', message: 'Reminder: Don’t forget to complete your medical form', timestamp: '2025-04-17 15:45', read: true },
    ]);

    const handleMarkAsRead = (id) => {
        setNotifications(notifications.map(notif => 
            notif.id === id ? { ...notif, read: true } : notif
        ));
    };

    const handleDelete = (id) => {
        setNotifications(notifications.filter(notif => notif.id !== id));
    };

    return (
        <div className="notifications-container">
            <h1>Notifications</h1>
            <ul className="notifications-list">
                {notifications.map((notif) => (
                    <li
                        key={notif.id}
                        className={`notification-item ${notif.read ? 'read' : 'unread'}`}
                    >
                        <div className="notification-content">
                            <p className="notification-message">{notif.message}</p>
                            <span className="timestamp">{notif.timestamp}</span>
                        </div>
                        <div className="notification-actions">
                            {!notif.read && (
                                <button onClick={() => handleMarkAsRead(notif.id)}>Mark as Read</button>
                            )}
                            <button onClick={() => handleDelete(notif.id)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Notifications;

