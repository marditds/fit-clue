import { Form, Button } from 'react-bootstrap';
import { LoadingComponent } from '../Loading/LoadingComponent';

export const DashboardForm = ({
    title,
    description,
    fields,
    onSubmit,
    buttonLabel,
    isLoading,
    isDisabled,
    successMsg,
    errorMsg
}) => {
    return (
        <>
            <h4>{title}</h4>
            <p className='text-muted'>{description}</p>

            <Form onSubmit={onSubmit}>
                {fields.map((field) => (
                    <Form.Group key={field.id} className='mb-3' controlId={field.id}>
                        <Form.Label>{field.label}</Form.Label>
                        <Form.Control
                            type={field.type}
                            placeholder={field.placeholder}
                            value={field.value}
                            onChange={field.onChange}
                        />
                    </Form.Group>
                ))}

                <Button
                    type='submit'
                    disabled={isDisabled}
                    className='w-100'
                >
                    {!isLoading ? buttonLabel : <LoadingComponent />}
                </Button>

                <Form.Text className={successMsg ? 'text-success' : 'text-danger'}>
                    {successMsg || errorMsg}
                </Form.Text>
            </Form>
        </>
    );
}; 