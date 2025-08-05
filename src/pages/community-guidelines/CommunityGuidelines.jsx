import { Accordion, Col } from 'react-bootstrap';
import { commGuideParags } from '../../components/Legal/commGuidelineData';
import { LegalTemplate } from '../../components/Legal/LegalTemplate';
import { allReportCategories } from '../../lib/data/reportCategories';
import { Icon } from '../../components/Accessories/Icon';
import { useState } from 'react';

const ReportCategoriesAccordion = ({ categories }) => {

    const [activeKey, setActiveKey] = useState('0');

    const isOpen = activeKey

    const handleToggle = (key) => {
        setActiveKey(activeKey === key ? null : key);
    };

    return (
        <Accordion activeKey={activeKey}>
            {
                categories.map((category, idx) => {
                    return (
                        <Accordion.Item eventKey={`${idx}`} key={idx}>
                            <Accordion.Header
                                onClick={() => handleToggle(`${idx}`)}
                            >
                                {category.title}
                                <span style={{ marginLeft: 'auto' }}>
                                    {
                                        isOpen ?
                                            <Icon className='bi bi-caret-down-square ms-auto' /> :
                                            <Icon className={'bi bi-caret-up-square ms-auto'} />
                                    }
                                </span>
                            </Accordion.Header>
                            <Accordion.Body>
                                <ul>
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
