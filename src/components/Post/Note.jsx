import { useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap'
import { Icon } from '../Accessories/Icon'
import { UserNoteForm } from '../Form/UserNoteForm';
import { LoadingComponent } from '../Loading/Loading';
import { devError, devLog } from '../../lib/utils/devConsole';

export const Note = ({ userNote, setUserNote, newUserNote, setNewUserNote, locationPathname, userId, updateUserNote }) => {

    const [showEditNoteField, setShowEditNoteField] = useState(false);
    const [isSavingNewNote, setIsSavingNewNote] = useState(false);
    const [noteUpdateMsgSccss, setNoteUpdateMsgSccss] = useState(null);
    const [noteUpdateMsgErr, setNoteUpdateMsgErr] = useState(null);

    const onEditNoteBtnClick = () => {

        devLog({ userNote, newUserNote });

        if (newUserNote !== userNote) {
            if (newUserNote?.length > 1)
                onSaveNoteBtnClick();
        }
        setShowEditNoteField(preVal => !preVal);
    }

    const onSaveNoteBtnClick = async () => {
        try {
            setIsSavingNewNote(true);

            const res = await updateUserNote();

            if (res === 'success') {
                setUserNote(newUserNote);
                setNoteUpdateMsgSccss('Focus updated successfully.');
                setNoteUpdateMsgErr(null);
                return;
            } else {
                setNoteUpdateMsgErr('Please try again later.');
                setNoteUpdateMsgSccss(null);
            }
        } catch (error) {
            devError('Error saving note:', error);
        } finally {
            setIsSavingNewNote(false);
        }

    }

    const onCancelEditClick = () => {
        setNewUserNote(userNote);
        setNoteUpdateMsgSccss(null);
        setNoteUpdateMsgErr(null);
        setShowEditNoteField(false);
    };

    return (
        <div>
            <Row className='mx-auto w-100 post__user-note-row'>
                <Col>
                    <Row>
                        <Col className='d-flex'>
                            <h3 className='mb-0'>
                                <Icon
                                    className='bi bi-bullseye'
                                    marginEndSize={'2'}
                                />Focus
                            </h3>
                            {userId &&
                                <div className='ms-auto d-flex flex-column align-items-end'>
                                    <div className='d-flex gap-2'>
                                        <Button onClick={onEditNoteBtnClick}>
                                            {!showEditNoteField ? (!isSavingNewNote ? 'Edit' : <LoadingComponent loadingText={'Saving'} />) : 'Save'}
                                        </Button>

                                        {showEditNoteField &&
                                            <Button onClick={onCancelEditClick} className='mb-3'>
                                                Cancel
                                            </Button>
                                        }
                                    </div>

                                    {
                                        noteUpdateMsgSccss ?
                                            <small className='mt-1 text-success' >
                                                {noteUpdateMsgSccss}
                                            </small>
                                            : noteUpdateMsgErr ?
                                                <small className='mt-1' style={{ color: 'var(--main-danger-color)' }}>
                                                    {noteUpdateMsgErr}
                                                </small>
                                                : null
                                    }

                                </div>
                            }
                        </Col>
                    </Row>

                    {
                        !showEditNoteField ?
                            <p className='py-4 mb-0'>
                                {userNote}
                            </p> : null
                    }

                    {showEditNoteField &&
                        <Form>
                            <UserNoteForm
                                userNote={newUserNote || userNote}
                                setUserNote={setNewUserNote}
                                locationPathname={locationPathname}
                            />
                        </Form>
                    }


                </Col>
            </Row>
        </div>
    )
}
