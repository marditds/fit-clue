import { useState } from 'react';
import { Button, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { TextTooltipOnClick } from '../Accessories/CustomTooltip';
import { Icon } from '../Accessories/Icon';

export const SharePost = () => {

    const location = useLocation();

    const currentUrl = window.location.origin + location.pathname;
    const [isUrlCopied, setIsUrlCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(currentUrl)
            .then(() => {
                setIsUrlCopied(true);

                setTimeout(() => setIsUrlCopied(false), 800)
            })
            .catch((err) => {
                console.error('Failed to copy: ', err);
                setIsUrlCopied(false);
            });
    };

    return (
        <div>
            <Row className='mx-auto w-100 post__share-page-row'>
                <Col className='py-4 border border-bottom-1 border-top-0 border-start-0 border-end-0'>
                    <h3>
                        <Icon
                            className='bi bi-share'
                            marginEndSize={'2'}
                        />Share This Page
                    </h3>
                    <p className='mb-0'>
                        Share this link with your network and ask for help completing this fashion collection!
                    </p>
                    <Form>
                        <Form.Group controlId='share-url'>
                            <InputGroup>
                                <Form.Control
                                    value={currentUrl}
                                    readOnly
                                    className='me-2'
                                />
                                <TextTooltipOnClick
                                    isItemClicked={isUrlCopied}
                                    tooltipText={isUrlCopied && 'Copied!'}
                                >
                                    <Button
                                        type='button'
                                        onClick={handleCopy}
                                    >
                                        copy
                                    </Button>
                                </TextTooltipOnClick>
                            </InputGroup>
                        </Form.Group>
                    </Form>
                </Col>
            </Row>
        </div>
    )
}
