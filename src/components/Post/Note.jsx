import { useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap'
import { Icon } from '../Accessories/Icon'
import { UserNoteForm } from '../Form/UserNoteForm';
import { LoadingComponent } from '../Loading/Loading';
import { devError, devLog } from '../../lib/utils/devConsole';

export const Note = ({ userNote, setUserNote, newUserNote, setNewUserNote, locationPathname, userId, updateUserNote }) => {

    const [showEditNoteField, setShowEditNoteField] = useState(false);
    const [isSavingNewNote, setIsSavingNewNote] = useState(false);
    const [noteUpdateMsg, setNoteUpdateMsg] = useState(null);

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
                return;
            } else {
                setNoteUpdateMsg('Please try again later.')
            }
        } catch (error) {
            devError('Error saving note:', error);
        } finally {
            setIsSavingNewNote(false);
        }

    }

    return (
        <div>
            <Row className='mx-auto w-100 post__user-note-row'>
                <Col className='pb-'>
                    <Row>
                        <Col className='d-flex'>
                            <h3 className={`mb-0 ${showEditNoteField ? 'pb-4' : 'pb-0'}`}>
                                <Icon
                                    className='bi bi-file-earmark-text'
                                    marginEndSize={'2'}
                                />Note
                            </h3>
                            {userId &&
                                <span className='ms-auto'>
                                    {noteUpdateMsg}
                                    <Button
                                        onClick={onEditNoteBtnClick}
                                        className='ms-2'
                                    >
                                        {!showEditNoteField ? (!isSavingNewNote ? 'Edit' : <LoadingComponent loadingText={'Saving'} />) : 'Save'}
                                    </Button>
                                </span>
                            }
                        </Col>
                    </Row>

                    {
                        !showEditNoteField ?
                            <p className='py-4 mb-0'>
                                {userNote && !newUserNote ? userNote : newUserNote}
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
