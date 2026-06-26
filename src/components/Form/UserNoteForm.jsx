import { Form, Row, Col, Button } from 'react-bootstrap'
import { Icon } from '../Accessories/Icon';
import { useState, useEffect } from 'react';

export const UserNoteForm = ({ userNote, setUserNote, locationPathname, disabled }) => {

    const [isSlide, setIsSlide] = useState(false);
    const [slideNumber, setSlideNumber] = useState(1);
    const [position, setPosition] = useState('');

    // const userNoteCharCount = 150;

    const ITEM_POSITION = [
        { label: 'Select position...', value: '', disabled: false },

        { label: 'Left', value: '', disabled: true },
        { label: 'Top-Left', value: 'Top-Left', disabled: false },
        { label: 'Center-Left', value: 'Center-Left', disabled: false },
        { label: 'Bottom-Left', value: 'Bottom-Left', disabled: false },

        { label: 'Center', value: '', disabled: true },
        { label: 'Top-Center', value: 'Top-Center', disabled: false },
        { label: 'Center-Center', value: 'Center-Center', disabled: false },
        { label: 'Bottom-Center', value: 'Bottom-Center', disabled: false },

        { label: 'Right', value: '', disabled: true },
        { label: 'Top-Right', value: 'Top-Right', disabled: false },
        { label: 'Center-Right', value: 'Center-Right', disabled: false },
        { label: 'Bottom-Right', value: 'Bottom-Right', disabled: false }
    ];

    useEffect(() => {
        if (!isSlide && !position) {
            setUserNote('Not Provided');
            return;
        }
        const parts = [];
        if (isSlide) parts.push(`Slide ${slideNumber}`);
        if (position) parts.push(position);

        setUserNote(`Looking for an item on ${parts.join(', ')}`);
    }, [isSlide, slideNumber, position, setUserNote]);

    return (
        <Form.Group className='mb-3 border border-1 rounded-1 px-3 py-3' controlId='formNote'>
            {
                locationPathname === '/post/create' &&
                <Form.Label>
                    <Icon className='bi bi-bullseye fs-5' marginEndSize='1' />
                    Focus <small>(optional)</small>
                </Form.Label>
            }

            <Row>
                <Col xs={12} md={6} className='mb-2 mb-md-0'>
                    <Form.Label>Is this a slide?</Form.Label>
                    <Form.Check
                        type='switch'
                        id='slide-switch'
                        label={isSlide ? 'Yes' : 'No'}
                        checked={isSlide}
                        onChange={(e) => setIsSlide(e.target.checked)}
                        disabled={disabled}
                    />
                </Col>
                {
                    isSlide && (
                        <Col>
                            <Form.Label>Slide number</Form.Label>
                            <Form.Control
                                type='number'
                                width={20}
                                value={slideNumber}
                                min={1}
                                max={20}
                                onChange={(e) => setSlideNumber(e.target.value)}
                                disabled={disabled || !isSlide}
                            />
                        </Col>
                    )
                }
            </Row>

            <hr />

            <Row className='mb-2'>
                <Col>
                    <Form.Label>Item postion</Form.Label>
                    <Form.Select
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                    // disabled={disabled || !isSlide}
                    >
                        {
                            ITEM_POSITION.map((item, idx) => {
                                return (
                                    <option key={idx} value={item.value} disabled={item.disabled}>
                                        {item.label}
                                    </option>
                                )
                            })
                        }
                    </Form.Select>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Form.Label className='mt-2'>Your focus:</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder=''
                        value={userNote === 'Not provided' ? '' : userNote}
                        disabled
                        onChange={e => setUserNote(e.target.value)}
                    // maxLength={userNoteCharCount}
                    />
                </Col>
            </Row>
            {/* <div className='d-flex justify-content-end mt-1'>
                <small className={userNote?.length >= userNoteCharCount ? 'text-danger' : 'text-muted'}>
                    {userNote === 'Not provided' ? 0 : userNote?.length} / {userNoteCharCount}
                </small>
            </div> */}
        </Form.Group>
    )
}