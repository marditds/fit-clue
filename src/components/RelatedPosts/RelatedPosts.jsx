import { Button, Col, Row } from 'react-bootstrap';
import { LoadingComponent } from '../Loading/Loading';
import './RelatedPosts.css';

export const RelatedPosts = ({ headerText, children }) => {
    return (
        <Row className='sticky-top related-posts__div p-2'>
            <Col>
                <h3 className='text-left text-break'>
                    {headerText}
                </h3>
                {children}
            </Col>
        </Row>
    )
}

export const LoadMoreButton = ({ onClick, hasMore, className, isLoading, loadMoreText, loadingText, noMoreText }) => {
    return (
        <Button
            onClick={onClick}
            disabled={!hasMore}
            className={className || ''}
        >
            {hasMore ? (
                !isLoading ?
                    loadMoreText :
                    <LoadingComponent
                        loadingText={loadingText || ''}
                    />
            ) : (
                noMoreText
            )}
        </Button>
    )
}

