import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import './SimilarityLevelToolTip.css';

export const SimilarityLevelToolTip = ({ children }) => {
    return (
        <OverlayTrigger overlay={
            <Tooltip className='similarity__tool-tip'>
                {children}
            </Tooltip>
        }>
            <a>
                <i className='bi bi-question-square ms-2' />
            </a>
        </OverlayTrigger>
    )
}
