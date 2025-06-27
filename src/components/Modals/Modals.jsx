import { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { commentReportCategories } from '../../lib/data/reportCategories';
import { usePosts } from '../../lib/hooks/usePosts';

export const Modals = () => {

    const { createReportComment } = usePosts();

    const [otherText, setOtherText] = useState('');
    const [selectedReason, setSelectedReason] = useState('');
    const [showReportCommentModal, setShowReportCommentModal] = useState(false);
    const [isCommentReportSubmitted, setIsCommentReportSubmitted] = useState(false);
    const [isCommentReportGettingSubmitted, setIsCommentReportGettingSubmitted] = useState(false);
    const [isOtherSelected, setIsOtherSelected] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [isReportSubmitted, setIsReportSubmitted] = useState(null);

    const handleCloseReportCommentModal = () => {
        setShowReportCommentModal(false);
    }

    const handleReportCommentClick = (item) => {
        console.log('item:', item);
        setSelectedItem(item);
        setSelectedItemId(item.$id);
        setShowReportCommentModal(true);
    };

    const handleClose = () => {
        setShowReportCommentModal(false);
        setSelectedItem(null);
        setSelectedReason('');
        setOtherText('');
        setIsOtherSelected(false);
        setIsCommentReportSubmitted(false);
    };

    const onSubmitReportCommentClick = async () => {
        setIsCommentReportGettingSubmitted(true);
        try {
            await createReportComment(selectedItemId, selectedReason);

            setIsCommentReportSubmitted(true);

            setTimeout(() => handleClose(), 2000);

        } catch (error) {
            console.error('Error submitting report:', error);
        } finally {
            setIsCommentReportGettingSubmitted(false);
        }
    }

    return (
        <Modal show={showReportCommentModal} onHide={handleCloseReportCommentModal}>
            <Modal.Header closeButton>
                <Modal.Title>Report Item</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {isCommentReportSubmitted ? (
                    <div>
                        <p>Your report has been submitted successfully.</p>
                    </div>
                ) : (
                    <>
                        <p>
                            Reporting: <strong>{selectedItem?.item} from {selectedItem?.company_name}</strong>
                        </p>
                        <Form>
                            {commentReportCategories.map((category, index) => (
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
                <Button onClick={handleCloseReportCommentModal}>
                    {isCommentReportSubmitted ? 'Close' : 'Cancel'}
                </Button>
                {!isCommentReportSubmitted && (
                    <Button
                        disabled={!selectedReason || isCommentReportGettingSubmitted}
                        onClick={onSubmitReportCommentClick}
                    >
                        {!isCommentReportGettingSubmitted ?
                            'Submit' :
                            'Submitting Report'}
                    </Button>
                )}
            </Modal.Footer>
        </Modal>
    )
}
