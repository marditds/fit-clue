import React, { useEffect, useState } from 'react'
import { usePosts } from '../../lib/hooks/usePosts';
import { useUser } from '../../lib/hooks/useUser';
import { Col, Container, ListGroup, Row } from 'react-bootstrap';
import { LoadingComponent } from '../Loading/Loading';
import { devError, devLog } from '../../lib/utils/devConsole';

const TopContributors = () => {

    const { fetchContributorsRanking } = useUser();

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

    useEffect(() => {
        devLog('topContributors:', topContributors)
    }, [topContributors])

    if (isGridLoading) return (
        <Container>
            <Row>
                <Col>
                    <LoadingComponent className={'mt-5'} loadingText={'Loading the featured posts'} />
                </Col>
            </Row>
        </Container>);

    return (
        <Container className='mb-5 px-sm-4 py-3 border main-border-radius'>
            <Row className='align-items-center'>
                <Col>
                    <h5 className='text-uppercase secondary-text-color text-left mb-3'>
                        Top contributors
                    </h5>
                </Col>
            </Row>
            <Row>
                <Col>
                    <ol className='d-flex flex-wrap align-items-center justify-content-start mb-0 list-unstyled gap-3'>
                        {
                            topContributors.map(((contributor, idx) => {
                                return (
                                    <li key={idx} className='px-2 py-1 border main-border-radius fw-bold secondary-bg-color'>
                                        <span className='tertiary-text-color secondary-font-size'>{idx + 1}</span>
                                        <span className='px-3'>{contributor.username}</span>
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