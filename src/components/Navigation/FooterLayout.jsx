import { Container } from 'react-bootstrap';

export const FooterLayout = ({ children }) => {
    return (
        <footer className='navbar__body border border-1 border-bottom-0 py-3 mt-auto mt-auto'>
            <Container>
                {children}
            </Container>
        </footer>
    )
}
