import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function StatCard({ title, value, icon, bgColor }) {
    return (
        <div className={`rounded-lg p-6 shadow-md text-white ${bgColor}`}>
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <h3 className="text-sm font-medium uppercase leading-tight">
                        {title}
                    </h3>
                    <p className="mt-1 text-3xl font-bold">{value}</p>
                </div>
                <div className="ml-4">
                    <FontAwesomeIcon icon={icon} className="h-8 w-8 opacity-75" />
                </div>
            </div>
        </div>
    );
}