import { Link, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import './Navigation.css';

export const BackButton = ({ className }) => {

    const navigate = useNavigate();

    return (
        <Button
            // as={Link}
            onClick={() => navigate(-1)}
            style={{
                position: 'relative'
            }}
            className={`d-flex justify-content-center align-items-center back-button ${className || ''}`}
        >
            ←
            Go Back
        </Button>
    );
}

