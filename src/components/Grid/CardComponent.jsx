import { Button, Card } from 'react-bootstrap'

export const CardComponent = ({ personality_name, children, href }) => {
    return (
        <Card className='border border-1 rounded-3 h-100 w-auto'>
            {/* <Card.Img variant='top' src='holder.js/100px180' /> */}
            <Card.Body className='d-flex flex-column'>
                <Card.Title>{personality_name}</Card.Title>
                {children}
                <Card.Footer className='mt-auto'>
                    <a href={href} variant='primary'>Go somewhere</a>
                </Card.Footer>
            </Card.Body>
        </Card>
    )
}