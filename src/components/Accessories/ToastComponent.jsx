import { Toast, ToastContainer } from 'react-bootstrap';
import { DashboardLayout } from '../Dashboard/DashboardLayout';
import { useBreakpoints } from '../../lib/hooks/useBreakpoints';
import { useState } from 'react';

export const ToastForDashboard = ({ showToast, setShowToast, toastTitle, toastText }) => {

    const { isXs, isSm } = useBreakpoints();

    setTimeout(() => setShowToast(false), 5000);

    const isSmallScreen = isXs || isSm;

    return (
        <DashboardLayout
            rowStyle={{ maxWidth: '1320px' }}
            colTwoClassName={`mt-5 ${isSmallScreen ? 'd-flex justify-content-start' : ''}`}
        >
            <Toast
                show={showToast}
                onClose={() => setShowToast(false)}
                style={{
                    position: 'fixed',
                    top: isSmallScreen ? '2rem' : undefined,
                    bottom: !isSmallScreen ? '1.9rem' : undefined,
                    right: !isSmallScreen ? '5rem' : undefined,
                    left: isSmallScreen ? '50%' : undefined,
                    transform: isSmallScreen ? 'translateX(-50%)' : undefined,
                    cursor: 'pointer',
                    zIndex: 1500,
                    maxWidth: isSmallScreen ? '90%' : '500px',
                }}
                className='toast__full'
            >
                <Toast.Header className='border-0' style={{ maxHeight: '42px' }}>
                    <strong className='me-auto'>
                        {toastTitle}
                    </strong>
                </Toast.Header>
            </Toast>
        </DashboardLayout>
    );
};

export const ToastGeneral = ({ signOutSucessMsg, showToast, setShowToast }) => {

    const onCloseToast = () => {
        setShowToast(false);
    }

    setTimeout(() => setShowToast(false), 5000);

    return (
        <ToastContainer
            className='p-3 ms-auto fixed-bottom'
            style={{ zIndex: 1 }}
        >
            <Toast show={showToast} onClose={onCloseToast}>
                <Toast.Header>
                    <img
                        src='holder.js/20x20?text=%20'
                        className='rounded me-2'
                        alt=''
                    />
                    <strong className='me-auto'>Alert!</strong>
                </Toast.Header>
                <Toast.Body>{signOutSucessMsg}</Toast.Body>
            </Toast>
        </ToastContainer>
    )
}
