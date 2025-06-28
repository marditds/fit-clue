import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import './CustomTooltip.css';

export const CustomTooltip = ({ iconClassName, tooltipText }) => {
    return (
        <OverlayTrigger
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
            <Button className='p-0'>
                <i className={iconClassName} />
            </Button>
        </OverlayTrigger>
    )
}
