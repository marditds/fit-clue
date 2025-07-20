import { useState } from 'react'
import { Col, Row, Button } from 'react-bootstrap'
import { ItemLinkCol } from './ItemLinkCol'
import { ReportModal } from '../Modals/Modals'
import { reportCategories } from '../../lib/data/reportCategories'
import { usePosts } from '../../lib/hooks/usePosts'
import { useBreakpoints } from '../../lib/hooks/useBreakpoints'
import { Icon } from '../Accessories/Icon'

export const ItemsLinks = ({ itemsLinks, isLoggedIn }) => {

    const { createReportLink } = usePosts();

    const { isXs, isMd } = useBreakpoints();

    // Report user generated links
    const [showModal, setShowModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const handleReportClick = (item) => {
        console.log("item:", item);
        setSelectedItem(item);
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setSelectedItem(null);
    };

    const onSubmitReportLinkClick = async (selectedItemLinkId, reason) => {
        await createReportLink(selectedItemLinkId, reason);
    }

    return (
        <div>
            {/* Header */}
            {itemsLinks?.length > 0 &&
                < Row className='post__div-links-row w-100 mx-auto sticky-top'>
                    <Col className='d-flex justify-content-center align-items-center'>
                        Item
                    </Col>
                    <Col className='d-flex justify-content-center align-items-center'>
                        Brand
                    </Col>
                    <Col className='d-flex justify-content-center align-items-center'>
                        Similarity
                    </Col>
                    <Col className={`d-flex justify-content-center align-items-center ${!isLoggedIn ? 'd-none' : ''}`}>
                    </Col>
                </Row>
            }


            {/* Items links */}
            {itemsLinks?.length > 0 ?
                itemsLinks?.map((itemLink) => {
                    return (
                        <Row
                            key={itemLink.$id}
                            className='py-3 post__div-link-item mx-auto border border-top-0 border-start-0 border-end-0 border-bottom-1'
                        >
                            <a
                                href={itemLink.href}
                                target='_blank'
                                className={`d-flex align-items-start align-items-lg-center justify-content-center px-0 ${!isLoggedIn ? 'col' : 'col-9'}`}
                            >
                                <ItemLinkCol
                                    displayText={itemLink.item}
                                    tooltipText={itemLink.item}
                                    maxLength={11}
                                />

                                <ItemLinkCol
                                    displayText={itemLink.company_name}
                                    tooltipText={itemLink.company_name}
                                    maxLength={8}
                                />

                                <ItemLinkCol
                                    displayText={itemLink.similarity_level}
                                    tooltipText={itemLink.similarity_level}
                                    maxLength={22}
                                />
                            </a>

                            <Col xs={3}
                                className={`d-flex justify-content-center align-items-center link__report-btn-col ${!isLoggedIn ? 'd-none' : ''}`}>
                                <Button
                                    className='px-2 py-1 link__report-btn'
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleReportClick(itemLink);
                                    }}
                                >
                                    <Icon
                                        className='bi bi-flag'
                                        marginSize={isMd ? '0' : '2'}
                                    />Report
                                </Button>
                            </Col>
                        </Row>
                    )
                })
                :
                <Row className='mx-auto post__div-no-links-row'>
                    <Col className='text-center border border-top-1 border-start-0 border-end-0 border-bottom-1 py-4'>
                        <h5 className='fw-bold'>
                            No Shopping Links Yet
                        </h5>
                        <p className='mb-0'>
                            Start building this fashion collection by adding its first shopping link below!
                        </p>
                    </Col>
                </Row>
            }

            {/* Report Link modal */}
            <ReportModal
                itemId={selectedItem?.$id}
                onClose={handleClose}
                reportCategories={reportCategories}
                show={showModal}
                onSubmitReport={onSubmitReportLinkClick}
            />
        </div>
    )
}
