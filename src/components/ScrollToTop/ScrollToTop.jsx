import React from 'react';
import { Button } from 'react-bootstrap';
import { TextTooltip } from '../ToolTip/CustomTooltip';

export const ScrollToTop = () => {
    // Function to scroll to top smoothly
    const handleClick = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

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
                    zIndex: 9999,
                }}
            >
                <i className='bi bi-arrow-up-square d-flex justify-content-center align-items-center fs-4' />
            </Button>
        </TextTooltip>
    );
}; 