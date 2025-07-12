import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import './CustomTooltip.css';

export const CustomTooltip = ({ iconClassName, tooltipText }) => {
    return (
        <OverlayTrigger
            // show
            placement='top'
            overlay={
                <Tooltip className='tool-tip__custom'>

                    {
                        (Array.isArray(tooltipText)) ?
                            <ul className='text-start list-unstyled'>
                                {tooltipText.map((option, idx) => (
                                    <li key={idx}>
                                        <strong>
                                            {option.label}
                                        </strong>
                                        - {option.description}
                                    </li>
                                ))}
                            </ul>
                            :
                            tooltipText
                    }

                </Tooltip>
            }>
            <Button className='p-2 ms-2'>
                <i className={`d-flex justify-content-center align-items-center ${iconClassName}`} />
            </Button>
        </OverlayTrigger>
    )
}

export const TextTooltip = ({ tooltipText, children }) => {
    return (
        <OverlayTrigger
            // show 
            placement='top'
            overlay={
                <Tooltip className='tool-tip__custom'>
                    {
                        tooltipText
                    }
                </Tooltip>
            }>
            {
                children
            }
        </OverlayTrigger>
    )
}

export const TextTooltipOnClick = ({ isItemClicked, tooltipText, children }) => {
    return (
        <OverlayTrigger
            show={isItemClicked}
            placement='top'
            overlay={
                <Tooltip className='tool-tip__custom'>
                    {
                        tooltipText
                    }
                </Tooltip>
            }>
            {
                children
            }
        </OverlayTrigger>
    )
}


