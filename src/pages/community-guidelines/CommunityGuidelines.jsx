import { Accordion, Col } from 'react-bootstrap';
import { commGuideParags } from '../../components/Legal/commGuidelineData';
import { LegalTemplate } from '../../components/Legal/LegalTemplate';
import { allReportCategories } from '../../lib/data/reportCategories';
import { Icon } from '../../components/Accessories/Icon';
import { useState } from 'react';

const ReportCategoriesAccordion = ({ categories }) => {

    const [activeKey, setActiveKey] = useState('0');

    const handleToggle = (key) => {
        setActiveKey(activeKey === key ? null : key);
    };

    return (
        <Accordion activeKey={activeKey}>
            {
                categories.map((category, idx) => {
                    return (
                        <Accordion.Item
                            eventKey={`${idx}`}
                            key={idx}
                            className='my-2'
                        >
                            <Accordion.Header
                                onClick={() => handleToggle(`${idx}`)}
                            >
                                {category.title}
                                <span style={{ marginLeft: 'auto' }}>
                                    {
                                        activeKey === `${idx}` ?
                                            <Icon className={'bi bi-caret-up-square ms-auto'} /> :
                                            <Icon className='bi bi-caret-down-square ms-auto' />

                                    }
                                </span>
                            </Accordion.Header>
                            <Accordion.Body>
                                <ul className='list-unstyled'>
                                    {
                                        category.arr.map((c, idx) => {
                                            return (
                                                <li key={idx}>
                                                    <h4>{c.label}</h4>
                                                    <p>{c.description}</p>
                                                </li>
                                            )
                                        })
                                    }
                                </ul>
                            </Accordion.Body>
                        </Accordion.Item>
                    )
                })
            }
        </Accordion>
    )
}


export const CommunityGuidelines = () => {

    return (
        <LegalTemplate
            title={'Community Guidelines'}
            content={
                <>
                    <Col>{commGuideParags.intro}</Col>
                    <Col>{commGuideParags.pargraph}</Col>
                    <Col>
                        <ReportCategoriesAccordion categories={allReportCategories} />
                    </Col>
                    <Col>{commGuideParags.outro}</Col>
                </>
            }
        />
    )
}
