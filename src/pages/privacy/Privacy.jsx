import { Col } from 'react-bootstrap'
import { LegalTemplate } from '../../components/Legal/LegalTemplate'
import PrivacyData from '../../components/Legal/PrivacyData'
import { useDocumentTitle } from '../../lib/hooks/useDocumentTitle';

const Privacy = () => {

    useDocumentTitle('Privacy Policy | FitClue');

    const { privacyPolicyData } = PrivacyData();

    return (
        <LegalTemplate
            title={'Privacy Policy'}
            content={
                <>
                    {
                        privacyPolicyData.map((data, idx) => {
                            return (
                                <Col key={idx}>
                                    <h3>{data.title}</h3>
                                    <div className='mb-3'>
                                        {data.description}
                                    </div>
                                </Col>
                            )
                        })
                    }
                </>
            }
        />
    )
}

export default Privacy;