import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { usePosts } from '../../lib/hooks/usePosts';
import { Col, Container, Row } from 'react-bootstrap';
import { LoadingPage } from '../../components/Loading/Loading';
import { InstagramEmbedCards } from '../../components/Post/InstagramEmbedCards ';
import { ScrollToTop } from '../../components/ScrollToTop/ScrollToTop';
import { RelatedPosts } from '../../components/RelatedPosts/RelatedPosts';
import { morePersonalityData } from '../../lib/data/testData';

export const More = () => {

    const params = useParams()

    const { fetchPostsByPersonalityName } = usePosts();

    const [posts, setPosts] = useState([]);
    const [postsTotal, setPostsTotal] = useState(0);
    const [personalityName, setPersonalityName] = useState('');
    const [isResultsLoading, setIsResultsLoading] = useState(false);

    useEffect(() => {
        const fetchAllPostsByPersonalityId = async () => {
            setIsResultsLoading(true);
            try {

                // const moreResults = await fetchPostsByPersonalityName(params.personalityName);
                // setPosts(moreResults.rows);
                // setPostsTotal(moreResults.total);
                // setPersonalityName(moreResults.rows[0]?.personality_name)

                const moreResults = morePersonalityData;
                setPosts(moreResults);
                setPostsTotal(8);
                setPersonalityName(moreResults[0]?.personality_name)

            } catch (error) {
                console.error('Error loading more results:', error);
            } finally {
                setIsResultsLoading(false);
            }
        }
        fetchAllPostsByPersonalityId();
    }, []);

    return (
        <Container>

            {
                posts.length !== 0 &&

                <RelatedPosts
                    headerText={`More from ${personalityName} (${postsTotal})`}
                >
                    <p
                        className='text-center mb-0'
                        style={{ color: 'var1(--main-accent-color-hover)' }}
                    >
                        Get more style inspiration from Heather McDonald
                    </p>
                </RelatedPosts>
            }

            <Row>
                {
                    !isResultsLoading ?
                        <InstagramEmbedCards
                            posts={posts}
                        /> :
                        <Col>
                            <LoadingPage
                                loadingText={`Loading more from ${params.personalityName}`}
                            />
                        </Col>
                }
            </Row>

            <ScrollToTop />

        </Container>
    )
}