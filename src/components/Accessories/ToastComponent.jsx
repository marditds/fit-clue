import { Button, Toast, ToastContainer } from 'react-bootstrap';
import { DashboardLayout } from '../Dashboard/DashboardLayout';
import { useBreakpoints } from '../../lib/hooks/useBreakpoints';
import { useEffect, useState } from 'react';
import { Icon } from './Icon';

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
                {/* <Toast.Header className='border-0' style={{ maxHeight: '42px' }}>
                    <strong className='me-auto'>
                        
                    </strong>
                </Toast.Header> */}
                <Toast.Body className='w-100 d-flex justify-content-between align-items-center'>
                    {toastTitle}
                    <Button
                        type='button'
                        className='d-flex justify-content-center align-items-center'
                        onClick={() => setShowToast(false)}
                    >
                        <Icon className='bi bi-x-lg d-flex justify-content-center align-items-center' />
                    </Button>
                </Toast.Body>
            </Toast>
        </DashboardLayout>
    );
};

export const ToastGeneral = ({ signOutSucessMsg, setIsSignOutSucessful }) => {

    const [showToast, setShowToast] = useState(true);

    const onCloseToast = () => {
        setShowToast(false);
        setIsSignOutSucessful(false);
    }

    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => {
                onCloseToast();
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, []);

    return (
        <ToastContainer
            className='p-3 ms-auto fixed-bottom'
            style={{ zIndex: 1 }}
        >
            <Toast
                show={true}
                onClose={onCloseToast}
            >
                {/* <Toast.Header>
                    <strong className='me-auto'>Alert!</strong>
                </Toast.Header> */}
                <Toast.Body className='w-100 d-flex justify-content-between align-items-center'>
                    {signOutSucessMsg}
                    <Button
                        type='button'
                        onClick={onCloseToast}
                    >
                        <Icon className='bi bi-x-lg' />
                    </Button>
                </Toast.Body>
            </Toast>
        </ToastContainer>
    )
}
