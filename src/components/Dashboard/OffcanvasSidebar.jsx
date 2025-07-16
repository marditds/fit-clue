import { useState } from 'react';
import { Button, Offcanvas } from 'react-bootstrap';

export const OffcanvasSidebar = ({ children }) => {

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Button className='d-lg-none' onClick={handleShow}>
                Launch
            </Button>

            <Offcanvas show={show} onHide={handleClose} responsive='lg'>
                <Offcanvas.Header closeButton>
                </Offcanvas.Header>
                <Offcanvas.Body className='flex-column'>
                    {children}
                </Offcanvas.Body>
            </Offcanvas>
        </>
    );
}