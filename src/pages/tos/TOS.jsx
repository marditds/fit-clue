import { Col } from 'react-bootstrap';
import { LegalTemplate } from '../../components/Legal/LegalTemplate';
import { tosData } from '../../components/Legal/tosData';

const TOS = () => {
    return (
        <LegalTemplate
            title={'Terms of Service'}
            content={
                <>
                    {
                        tosData.map((term, idx) => {
                            return (
                                <Col key={idx}>
                                    <h3>{term.title}</h3>
                                    <p>{term.description}</p>
                                </Col>
                            )
                        })
                    }
                </>
            }
        />
    )
}

export default TOS;