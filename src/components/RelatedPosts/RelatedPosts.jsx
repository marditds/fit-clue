import { Button, Col, Row } from 'react-bootstrap'
import BackButton from '../Navigation/BackButton'
import { LoadingComponent } from '../Loading/Loading'

export const RelatedPosts = ({ headerText, children }) => {
    return (
        <div className='sticky-top'>
            <Row className='py-2 bg-white align-items-center'>
                <Col xs={12} md={1}>
                    <BackButton />
                </Col>
                <Col xs={12} md={10}>
                    <h3 className='text-center mb-0'>
                        {headerText}
                    </h3>
                </Col>
                <Col xs={12} md={1}></Col>
            </Row>
            <Row className='pb-2 bg-white'>
                <Col>
                    {children}
                </Col>
            </Row>
        </div>
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

