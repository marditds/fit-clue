import React from 'react'
import { Col, Row, Button } from 'react-bootstrap'
import { truncateString } from '../../lib/utils/truncateStrings'
import { TextTooltip } from '../ToolTip/CustomTooltip'
import { ItemLinkCol } from './ItemLinkCol'

export const ItemsLinks = ({ itemsLinks, handleReportClick }) => {
    return (
        <ul className='list-unstyled'>
            <Row className='sticky-top mx-auto post__div-links-row'>
                <Col className='d-flex justify-content-center align-items-center'>
                    Item
                </Col>
                <Col className='d-flex justify-content-center align-items-center'>
                    Brand
                </Col>
                <Col className='d-flex justify-content-center align-items-center'>
                    Similarity
                </Col>
                <Col className='d-flex justify-content-center align-items-center'>

                </Col>
            </Row>

            {
                itemsLinks?.map((itemLink) => {
                    return (
                        <li key={itemLink.$id} className='border border-top-0 border-start-0 border-end-0 border-bottom-1 d-flex justify-content-center mx-auto align-items-center  post__div-link-item'>
                            <Row className='w-100 d-flex justify-content-center align-items-center py-3'>
                                <a
                                    href={itemLink.href}
                                    target='_blank'
                                    className='d-flex align-items-start align-items-md-center justify-content-center col-9'
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
                                <Col xs={3} className='d-flex justify-content-center align-items-center'>
                                    <Button
                                        variant="outline-secondary"
                                        size="sm"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleReportClick(itemLink.$id);
                                        }}
                                    >
                                        Report <i className='bi bi-flag' />
                                    </Button>
                                </Col>
                            </Row>
                        </li>
                    )
                })
            }
        </ul>
    )
}
