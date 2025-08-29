import { useState, useEffect } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import './Modals.css';
import { LoadingComponent } from '../Loading/Loading';
import { Icon } from '../Accessories/Icon';

export const ReportModal = ({
    show,
    onClose,
    itemId,
    reportCategories,
    onSubmitReport
}) => {
    const [otherText, setOtherText] = useState('');
    const [selectedReason, setSelectedReason] = useState('');
    const [isOtherSelected, setIsOtherSelected] = useState(false);
    const [isReportSubmitted, setIsReportSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!show) {
            setSelectedReason('');
            setOtherText('');
            setIsOtherSelected(false);
            setIsReportSubmitted(false);
        }
    }, [show]);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            await onSubmitReport(itemId, selectedReason);
            setIsReportSubmitted(true);
            setTimeout(onClose, 2000);
        } catch (error) {
            console.error('Error submitting report:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal
            show={show}
            onHide={onClose}
            style={{ zIndex: 1501 }}
            className='report-modal'
        >
            <Modal.Header className='report-modal__header d-flex justify-content-between'>
                <Modal.Title>
                    Report
                </Modal.Title>
                <Button
                    type='button'
                    onClick={onClose}
                >
                    <Icon className='bi bi-x-lg' />
                </Button>
            </Modal.Header>
            <Modal.Body className='report-modal__body'>
                {isReportSubmitted ? (
                    <p>Your report has been submitted successfully.</p>
                ) : (
                    <Form className='report-modal__form'>
                        {reportCategories.map((category, index) => (
                            <Form.Check
                                type='radio'
                                id={`report-${index}`}
                                key={index}
                                name='reportReason'
                                label={<><strong>{category.label}</strong>: {category.description}</>}
                                value={category.short}
                                checked={selectedReason === category.short || (category.short === 'OTHER' && isOtherSelected)}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (value === 'OTHER') {
                                        setIsOtherSelected(true);
                                        setSelectedReason(otherText);
                                    } else {
                                        setIsOtherSelected(false);
                                        setOtherText('');
                                        setSelectedReason(value);
                                    }
                                }}
                            />
                        ))}

                        {isOtherSelected && (
                            <div className='mt-3'>
                                <Form.Label>
                                    Please describe the issue (max 300 characters)
                                </Form.Label>
                                <Form.Control
                                    as='textarea'
                                    rows={3}
                                    maxLength={300}
                                    value={otherText}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setOtherText(value);
                                        setSelectedReason(value);
                                    }}
                                />
                                <div className='text-muted text-end'>
                                    {otherText.length} / 300
                                </div>
                            </div>
                        )}
                    </Form>
                )}
            </Modal.Body>

            <Modal.Footer>
                <Button onClick={onClose}>
                    {isReportSubmitted ? 'Close' : 'Cancel'}
                </Button>
                {!isReportSubmitted && (
                    <Button
                        disabled={!selectedReason || isSubmitting}
                        onClick={handleSubmit}
                    >
                        {isSubmitting ? <LoadingComponent loadingText='Sumbitting' /> : 'Submit'}
                    </Button>
                )}
            </Modal.Footer>
        </Modal>
    );
};

export const PlainModal = ({ headerClassName, children, modalTitle, modalText, showModal, handleFunction, showModalFooter, firstBtnTxt, addSecondBtn, secondBtnTxt, handleSecondFunction, footerClassName }) => {
    return (
        <Modal
            show={showModal}
            onHide={handleFunction}
            className='report-modal'
        >
            {
                modalTitle &&
                <Modal.Header className={headerClassName} closeButton>
                    <Modal.Title>{modalTitle}</Modal.Title>
                </Modal.Header>
            }

            <Modal.Body className='report-modal__body'>
                {children}
                {modalText}
            </Modal.Body>

            {
                showModalFooter === true &&
                <Modal.Footer className={footerClassName}>

                    <Button onClick={handleFunction}
                        className='plain-modal__btn'
                    >
                        {firstBtnTxt}
                    </Button>

                    {
                        addSecondBtn === true &&
                        <Button onClick={handleSecondFunction}>
                            {secondBtnTxt}
                        </Button>
                    }

                </Modal.Footer>
            }
        </Modal>
    )
}
