import { useState, useEffect } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';

export const ReportModal = ({
    show,
    onClose,
    item,
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
            await onSubmitReport(item?.$id, selectedReason);
            setIsReportSubmitted(true);
            setTimeout(onClose, 2000);
        } catch (error) {
            console.error('Error submitting report:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Report Item</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {isReportSubmitted ? (
                    <p>Your report has been submitted successfully.</p>
                ) : (
                    <>
                        <p>
                            Reporting: <strong>{item?.item} from {item?.company_name}</strong>
                        </p>
                        <Form>
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
                    </>
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
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                    </Button>
                )}
            </Modal.Footer>
        </Modal>
    );
};