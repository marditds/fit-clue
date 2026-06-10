import { Accordion, Col } from 'react-bootstrap';
import { commGuideParags } from '../../components/Legal/commGuidelineData';
import { LegalTemplate } from '../../components/Legal/LegalTemplate';
import { allReportCategories } from '../../lib/data/reportCategories';
import { Icon } from '../../components/Accessories/Icon';
import { useState } from 'react';
import { AccordionComponent } from '../../components/Accessories/AccordionComponent';
import { useDocumentTitle } from '../../lib/hooks/useDocumentTitle';

export const CommunityGuidelines = () => {

    useDocumentTitle('Community Guidelines | FitClue');

    return (
        <LegalTemplate
            title={'Community Guidelines'}
            content={
                <>
                    <Col>
                        <p>
                            {commGuideParags.intro}
                        </p>
                    </Col>
                    <Col>
                        <p>
                            {commGuideParags.pargraph}
                        </p>
                    </Col>
                    <Col>
                        <AccordionComponent
                            itemsList={allReportCategories}
                            className={'mb-3'}
                        />
                    </Col>
                    <Col>
                        <p>
                            {commGuideParags.outro}
                        </p>
                    </Col>
                </>
            }
        />
    )
}
