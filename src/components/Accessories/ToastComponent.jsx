import { Toast } from 'react-bootstrap';
import { DashboardLayout } from '../Dashboard/DashboardLayout';
import { useBreakpoints } from '../../lib/hooks/useBreakpoints';

export const ToastComponent = ({ showToast, setShowToast, toastTitle, toastText }) => {

    const { isXs, isSm } = useBreakpoints();

    setTimeout(() => setShowToast(false), 3000);

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
