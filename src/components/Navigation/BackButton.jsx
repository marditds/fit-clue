import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import './Navigation.css';

function BackButton({ className }) {

    const navigate = useNavigate();

    return (
        <Button
            onClick={() => navigate(-1)}
            style={{
                position: 'relative'
            }}
            className={`d-flex justify-content-center align-items-center back-button ${className || ''}`}
        >
            {/* <i className='bi bi-arrow-left-square me-2' /> */}
            {/* <i className='bi bi-arrow-left' /> */}
            ←
            Go Back
        </Button>
    );
}

export default BackButton;
