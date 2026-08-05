import React, { useEffect, useState } from 'react'
import { usePosts } from '../../lib/hooks/usePosts';
import { useUser } from '../../lib/hooks/useUser';
import { Col, Container, Row } from 'react-bootstrap';
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

                // setTopContributors(tc);

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
                    <LoadingComponent className={'mt-5'} loadingText={'Loading the featured posts'} />
                </Col>
            </Row>
        </Container>);

    return (
        <Container className='py-5'>
            <Row className='justify-content-start'>
                <Col>
                    <h5 className='text-uppercase secondary-text-color'>
                        Top contributors
                    </h5>
                </Col>
            </Row>
            <Row>

            </Row>
        </Container>

    );
};

export default TopContributors