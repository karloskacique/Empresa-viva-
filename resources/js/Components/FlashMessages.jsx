import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faExclamationCircle, faInfoCircle, faTimes } from '@fortawesome/free-solid-svg-icons';

export default function FlashMessages() {
    const { flash } = usePage().props;
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const newMessages = [];
        if (flash.success) {
            newMessages.push({ type: 'success', content: flash.success, id: Date.now() + 's' });
        }
        if (flash.error) {
            newMessages.push({ type: 'error', content: flash.error, id: Date.now() + 'e' });
        }
        if (flash.message) {
            newMessages.push({ type: 'info', content: flash.message, id: Date.now() + 'm' });
        }

        if (newMessages.length > 0) {
            setMessages(prevMessages => [...prevMessages, ...newMessages]);
        }
    }, [flash]);

    useEffect(() => {
        if (messages.length > 0) {
            const timer = setTimeout(() => {
                setMessages(prevMessages => prevMessages.slice(1));
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [messages]);

    const removeMessage = (idToRemove) => {
        setMessages(prevMessages => prevMessages.filter(msg => msg.id !== idToRemove));
    };

    const getMessageTypeClasses = (type) => {
        switch (type) {
            case 'success':
                return 'bg-green-100 border-green-400 text-green-700';
            case 'error':
                return 'bg-red-100 border-red-400 text-red-700';
            case 'info':
                return 'bg-blue-100 border-blue-400 text-blue-700';
            default:
                return 'bg-gray-100 border-gray-400 text-gray-700';
        }
    };

    const getMessageIcon = (type) => {
        switch (type) {
            case 'success':
                return faCheckCircle;
            case 'error':
                return faExclamationCircle;
            case 'info':
                return faInfoCircle;
            default:
                return faInfoCircle;
        }
    };

    return (
        <div className="fixed top-4 right-4 z-50 space-y-3">
            {messages.map((msg) => (
                <div
                    key={msg.id}
                    className={`relative flex items-center p-4 border-l-4 rounded-md shadow-lg transition-transform transform ease-out duration-300 animate-slideIn ${getMessageTypeClasses(msg.type)}`}
                    role="alert"
                >
                    <div className="flex-shrink-0 mr-3">
                        <FontAwesomeIcon icon={getMessageIcon(msg.type)} className="w-5 h-5" />
                    </div>
                    <div className="flex-grow text-sm font-medium">
                        {msg.content}
                    </div>
                    <button
                        onClick={() => removeMessage(msg.id)}
                        className="ml-4 -mr-1 p-1 rounded-full text-current hover:bg-opacity-50 hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-current"
                    >
                        <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
                    </button>
                </div>
            ))}
        </div>
    );
}