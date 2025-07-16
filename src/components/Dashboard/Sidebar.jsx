import { Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useBreakpoints } from '../../lib/hooks/useBreakpoints';
import { OffcanvasSidebar } from './OffcanvasSidebar';

export const Sidebar = ({ username }) => {

    const { isXs, isSm, isMd } = useBreakpoints();

    const sidebarContent = (
        <>
            <Col className='text-center'>
                <h2>{username}</h2>
            </Col>

            <Col>
                <ul className='list-unstyled'>
                    <li>
                        <Link to='settings'>Account Settings</Link>
                    </li>
                    <li>
                        <Link to='saved-posts'>Saved Posts</Link>
                    </li>
                </ul>
            </Col>
        </>
    );

    return (
        <Col
            xs={12} lg={4}
            className='border'
            style={{
                minHeight: !isXs && !isSm && !isMd ? 'calc(100vh - 112px)' : 'fit-content'
            }}
        >
            <Row
                className='sticky-top px-4 px-lg-5 pt-lg-5'
            >
                <OffcanvasSidebar>
                    {sidebarContent}
                </OffcanvasSidebar>

            </Row>

        </Col>
    )
}
