import { Col } from "react-bootstrap";
import { truncateString } from "../../lib/utils/truncateStrings";
import { TextTooltip } from "../ToolTip/CustomTooltip";

export const ItemLinkCol = ({ tooltipText, displayText, maxLength }) => (
    <Col className='d-flex justify-content-center align-items-center text-center'>
        <TextTooltip tooltipText={tooltipText}>
            <span>{truncateString(displayText, maxLength)}</span>
        </TextTooltip>
    </Col>
);
