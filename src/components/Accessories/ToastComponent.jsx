import { Toast } from 'react-bootstrap';
import { LayoutDashboard } from '../Dashboard/LayoutDashboard';

export const ToastComponent = ({ showToast, setShowToast, toastTitle, toastText }) => {

    setTimeout(() => setShowToast(false), 3000);

    return (

        <LayoutDashboard
            rowClassName='fixed-bottom mx-auto justify-content-center'
            rowStyle={{ maxWidth: '1320px' }}
            colTwoClassName='mt-5 w-100 d-flex justify-content-center'

        >
            <Toast show={true} onClose={() => setShowToast(false)}>
                <Toast.Header>
                    <strong className='me-auto'>
                        {toastTitle}
                    </strong>
                </Toast.Header>
            </Toast>
        </LayoutDashboard>

    );
} 