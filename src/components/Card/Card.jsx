import { useLocation, Link } from 'react-router-dom';
import { Badge, Button, Col } from 'react-bootstrap';
import { TextTooltip } from '../Accessories/CustomTooltip';
import { Icon } from '../Accessories/Icon';
import { LoadingComponent } from '../Loading/Loading';
// import { useState } from 'react';

export const Card = ({ id, personalityName, iUrl, saveDocId, onDeleteSaveClick, isDeleteSaveLoading, tag }) => {

    const location = useLocation();

    const isHomepage = location.pathname === '/';

    const tagStyles = {
        Trending: {
            backgroundColor: '#C9748A',
            color: '#fff',
        },
        New: {
            backgroundColor: '#5B7FA6',
            color: '#fff',
        },
        default: {
            backgroundColor: '#000',
            color: '#fff'
        }
    };

    const baseTagStyle = {
        marginLeft: '15px',
        fontSize: '14px',
        fontWeight: 500,
        padding: '3px 9px',
        border: '0.5px solid var(--main-border-color)',
        borderRadius: '3px',
        whiteSpace: 'nowrap',
        lineHeight: 1,
    };

    // const [isDeleteSaveClicked, setIsDeleteSaveClicked] = useState(false);

    return (
        <Col
            xs={12}
            md={location.pathname.startsWith('/dashboard') ? 12 : 6}
            lg={location.pathname.startsWith('/dashboard') ? 12 : 6}
            xl={
                location.pathname.startsWith('/post') ? 5 :
                    location.pathname.startsWith('/search') ? 4 :
                        location.pathname.startsWith('/dashboard') ? 6 :
                            4
            }
            className={`d-flex flex-column ${!location.pathname.startsWith('/post') ? 'card__col justify-content-center' : 'post__col'}`}
        >
            <div className={` 
                ${!location.pathname.startsWith('/post') ?
                    'card__div card__div-featured h-100 d-flex flex-column justify-content-between' :
                    'd-flex flex-column justify-content-center align-items-start post__div sticky-top'}`
            }>

                <div className='w-100'>

                    {!location.pathname.startsWith('/post') &&
                        <div
                            className='d-flex justify-content-between align-items-center mb-2'>
                            <Link to={`/post/${id}`} className='d-flex justify-content-between w-100'>
                                <h3
                                    className='text-left d-flex align-items-center justify-content-start w-100 latest__card-name mb-0'
                                >
                                    {personalityName}

                                    {isHomepage && tag &&
                                        <Badge
                                            bg='none'
                                            style={{
                                                ...baseTagStyle,
                                                ...tagStyles[tag],
                                            }}
                                        >
                                            {tag}
                                        </Badge>
                                    }

                                </h3>
                            </Link>

                            {location.pathname === '/dashboard/saved-posts' &&
                                <TextTooltip
                                    tooltipText='Remove Save'>
                                    <Button
                                        type='button'
                                        onClick={() => onDeleteSaveClick(saveDocId)}
                                        disabled={isDeleteSaveLoading}
                                    >
                                        {isDeleteSaveLoading ? (
                                            <LoadingComponent loadingText=' ' />
                                        ) : (
                                            <i className='bi bi-x' />
                                        )}
                                    </Button>
                                </TextTooltip>
                            }
                        </div>
                    }

                    <blockquote
                        className='instagram-media'
                        data-instgrm-permalink={iUrl}
                        data-instgrm-version='14'
                        style={{
                            background: '#FFF',
                            border: 0,
                            borderRadius: '3px',
                            boxShadow: '0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)',
                            margin: '1rem 0',
                            maxWidth: '540px',
                            minWidth: '0',
                            width: '100%',
                            padding: '0',
                        }}
                    />
                </div>

                {
                    !location.pathname.startsWith('/post') &&
                    <Link to={`/post/${id}`} className='w-100 d-flex align-items-center card__div-details-link mt-aut0'>
                        <span className='me-auto'>View details</span>
                        <Icon className={'bi bi-chevron-right ms-auto fs-4'} />
                    </Link>
                }

                {
                    location.pathname.startsWith('/post') &&
                    <p className='cta mt-3 text-center w-100'>
                        <Link
                            to={`/search/personality/${encodeURIComponent(personalityName)}`}
                            className='fw-bolder'
                        >
                            Get more style inspiration from {personalityName} →
                        </Link>
                    </p>
                }

            </div>

        </Col>
    )
}