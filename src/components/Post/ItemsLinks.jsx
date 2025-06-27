import React from 'react'
import { Col, Row, Button } from 'react-bootstrap'

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
                {/* <Col className='d-flex justify-content-center align-items-center'>
            Report
        </Col> */}
            </Row>

            {
                itemsLinks?.map((itemLink) => {
                    return (
                        <li key={itemLink.$id} className='border border-top-0 border-start-0 border-end-0 border-bottom-1 d-flex justify-content-center align-items-center w-100 post__div-link-item'>

                            <Row className='w-100 d-flex justify-content-center align-items-center py-3'>
                                <a href={itemLink.href} target='_blank' className='d-flex align-items-center justify-content-center'>
                                    <Col className='d-flex justify-content-center align-items-center'>
                                        {/* <a href={itemLink.href} > */}
                                        <div>
                                            {itemLink.item}
                                        </div>
                                        {/* </a> */}
                                    </Col>

                                    <Col className='d-flex justify-content-center'>
                                        {/* <a href={itemLink.href}> */}
                                        {itemLink.company_name}
                                        {/* </a> */}
                                    </Col>
                                    <Col className='d-flex justify-content-center text-center'>
                                        {/* <a href={itemLink.href}> */}
                                        {itemLink.similarity_level}
                                        {/* </a> */}
                                    </Col>
                                </a>

                                {/* <Col className='d-flex justify-content-center' style={{ maxWidth: 'fit-content' }}>
                            <Button onClick={() => handleReportClick(itemLink)}
                                className='post__report-btn'
                            >
                                <i className='bi bi-flag' />
                            </Button>
                        </Col> */}

                            </Row>

                        </li>
                    )
                })
            }
        </ul>
    )
}
