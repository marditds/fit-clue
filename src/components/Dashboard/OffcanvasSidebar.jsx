import { useState } from 'react';
import { Button, Offcanvas } from 'react-bootstrap';

export const OffcanvasSidebar = ({ children }) => {

    const [show, setShow] = useState(false);

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    return (
        <>
            <Button
                className='d-lg-none w-25'
                onClick={handleShow}
            >
                <i className='bi bi-list' />
            </Button>

            <Offcanvas
                show={show}
                onHide={handleClose}
                responsive='lg w-100'
            >
                <Offcanvas.Header closeButton />
                <Offcanvas.Body className='flex-column'>
                    {
                        typeof children === 'function' ?
                            children({ close: handleClose }) :
                            children
                    }
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
}