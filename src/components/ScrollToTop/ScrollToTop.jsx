import { Button } from 'react-bootstrap';
import { TextTooltip } from '../Accessories/CustomTooltip';
import { useEffect, useState } from 'react';

export const ScrollToTop = () => {

    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 100) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);

        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    const handleClick = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (!isVisible) return null;

    return (
        <TextTooltip tooltipText={'Scroll to top'}>
            <Button
                className='py-2 d-flex justify-content-center align-items-center'
                onClick={handleClick}
                style={{
                    position: 'fixed',
                    bottom: '2rem',
                    right: '2rem',
                    cursor: 'pointer',
                    zIndex: 1500,
                }}
            >
                <i className='bi bi-arrow-up-square d-flex justify-content-center align-items-center fs-4' />
            </Button>
        </TextTooltip>
    );
}; 