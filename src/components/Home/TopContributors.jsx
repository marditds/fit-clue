import React, { useEffect, useState } from 'react'
import { usePosts } from '../../lib/hooks/usePosts';
import { useUser } from '../../lib/hooks/useUser';
import { Col, Container, ListGroup, Row } from 'react-bootstrap';
import { LoadingComponent } from '../Loading/Loading';
import { devError, devLog } from '../../lib/utils/devConsole';
import { Icon } from '../Accessories/Icon';
import { useBreakpoints } from '../../lib/hooks/useBreakpoints';

const TopContributors = () => {

    const { fetchContributorsRanking } = useUser();

    const { isXs, isSm } = useBreakpoints();

    const isScreenSmallOrSmaller = isXs || isSm;

    const [topContributors, setTopContributors] = useState([]);
    const [isGridLoading, setIsGridLoading] = useState(false);

    useEffect(() => {
        const getContributorsRanking = async () => {
            setIsGridLoading(true);
            try {
                const tc = await fetchContributorsRanking(5);

                devLog('top contributors in homepage', tc);

                setTopContributors(tc.rows);

            } catch (error) {
                devError('Error getting top contributors:', error);
            } finally {
                setIsGridLoading(false);
            }
        };
        getContributorsRanking();
    }, []);

    if (isGridLoading) return (
        <Container>
            <Row>
                <Col>
                    <LoadingComponent className={'mt-5'} loadingText={'Loading the top contributors'} />
                </Col>
            </Row>
        </Container>
    );

    return (
        <Container className='mb-5 px-sm-4 py-3 border main-border-radius'>
            <Row className='align-items-center'>
                <Col className='d-flex align-items-center mb-3 tertiary-text-color'>
                    <h5 className='text-uppercase secondary-text-color text-left mb-0'>
                        Top contributors
                    </h5>
                    <Icon className={`bi bi-star ms-2 ${isScreenSmallOrSmaller ? 'fs-6' : 'fs-5'}`} />
                </Col>
            </Row>
            <Row>
                <Col>
                    <ol className='d-flex flex-wrap align-items-center justify-content-start mb-0 list-unstyled gap-3'>
                        {
                            topContributors.map(((contributor, idx) => {
                                return (
                                    <li key={idx} className='px-3 py-1 border main-border-radius fw-bold secondary-bg-color'>
                                        <span className='tertiary-text-color secondary-font-size'>{idx + 1}</span>
                                        <span className='px-3'>{contributor.username || 'Deleted user'}</span>
                                        <span className='secondary-text-color'>{contributor.score}</span>
                                    </li>
                                )
                            }))
                        }
                    </ol>
                </Col>
            </Row>
            <Row>

            </Row>
        </Container>

    );
};

export default TopContributors