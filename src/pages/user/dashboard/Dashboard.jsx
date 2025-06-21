import React from 'react';
import { useOutletContext } from 'react-router-dom';

export const Dashboard = () => {

    const { userId, userEmail, username } = useOutletContext();

    return (
        <div>Dashboard</div>
    )
}
