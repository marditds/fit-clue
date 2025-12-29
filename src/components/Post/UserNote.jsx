import { useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap'
import { Icon } from '../Accessories/Icon'
import { UserNoteForm } from '../Form/UserNoteForm';

export const UserNote = ({ userNote, setUserNote, locationPathname, userId, updateUserNote }) => {

    const [showEditNoteField, setShowEditNoteField] = useState(false);

    const onEditNoteBtnClick = () => {
        setShowEditNoteField(true)
    }

    const onSaveNoteBtnClick = () => {
        setShowEditNoteField(false);
        updateUserNote();
    }

    return (
        <div>
            <Row className='mx-auto w-100'>
                <Col className='pb-4'>

                    <h3 className='d-flex'>
                        <Icon
                            className='bi bi-file-earmark-text'
                            marginEndSize={'2'}
                        />User's Note
                        {userId &&
                            <Button
                                onClick={!showEditNoteField ?
                                    onEditNoteBtnClick :
                                    onSaveNoteBtnClick}
                                className='ms-auto'
                            >
                                {!showEditNoteField ? 'Edit' : 'Save'}
                            </Button>
                        }
                    </h3>

                    <p className='mb-0'>
                        {
                            !showEditNoteField ?
                                (userNote ? userNote : 'Not Provided')
                                : ''
                        }
                    </p>
                    {showEditNoteField &&
                        <Form>
                            <UserNoteForm
                                userNote={userNote}
                                setUserNote={setUserNote}
                                locationPathname={locationPathname}
                            />
                        </Form>
                    }


                </Col>
            </Row>
        </div>
    )
}
