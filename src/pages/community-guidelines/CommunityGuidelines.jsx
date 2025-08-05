import { Accordion, Col } from 'react-bootstrap';
import { commGuideParags } from '../../components/Legal/commGuidelineData';
import { LegalTemplate } from '../../components/Legal/LegalTemplate';
import { allReportCategories } from '../../lib/data/reportCategories';

const ReportCategoriesAccordion = ({ categories }) => {
    return (
        <Accordion>
            {
                categories.map((category, idx) => {
                    return (
                        <Accordion.Item eventKey={idx} key={idx}>
                            <Accordion.Header>
                                {category.title}
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
