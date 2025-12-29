import { Form } from 'react-bootstrap'
import { Icon } from '../Accessories/Icon';

export const UserNoteForm = ({ userNote, setUserNote, locationPathname }) => {

    const userNoteCharCount = 150;

    return (
        <Form.Group className='mb-3' controlId='formNote'>
            {
                locationPathname === '/post/create' &&
                <Form.Label>
                    <Icon className='bi bi-file-earmark-text fs-5' marginEndSize='1' />
                    Note <small>(optional)</small>
                </Form.Label>
            }
            <Form.Control
                type='text'
                as='textarea'
                rows={3}
                placeholder='I would like to know the brand of the shoes in the third slide.'
                value={userNote || ''}
                onChange={e => setUserNote(e.target.value)}
                required
                maxLength={userNoteCharCount}
            />

            <div className='d-flex justify-content-end mt-1'>
                <small className={userNote?.length >= userNoteCharCount ? 'text-danger' : 'text-muted'}>
                    {userNote ? userNote.length : 0} / {userNoteCharCount}
                </small>
            </div>
        </Form.Group>
    )
}
