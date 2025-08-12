import { Col } from 'react-bootstrap';
import { LegalTemplate } from '../../components/Legal/LegalTemplate';
import TOSData from '../../components/Legal/TOSData';

const TOS = () => {

    const { tosData } = TOSData();

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
                                    {term.description}
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