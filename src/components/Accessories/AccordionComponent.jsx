import { useState } from 'react'
import { Accordion } from 'react-bootstrap';
import { Icon } from './Icon';

export const AccordionComponent = ({ className, itemsList }) => {

    const [activeKey, setActiveKey] = useState('0');

    const handleToggle = (key) => {
        setActiveKey(activeKey === key ? null : key);
    };

    return (
        <Accordion activeKey={activeKey} className={className}>
            {
                itemsList?.map((item, idx) => {
                    return (
                        <Accordion.Item
                            eventKey={`${idx}`}
                            key={idx}
                            className='mb-2'
                        >
                            <Accordion.Header
                                onClick={() => handleToggle(`${idx}`)}
                            >
                                {item.title}
                                <span style={{ marginLeft: 'auto' }}>
                                    {
                                        activeKey === `${idx}` ?
                                            <Icon className={'bi bi-caret-up-square ms-auto d-flex align-items-center'} /> :
                                            <Icon className='bi bi-caret-down-square ms-auto d-flex align-items-center' />

                                    }
                                </span>
                            </Accordion.Header>
                            <Accordion.Body>

                                {item.arr && <ul className='list-unstyled'>
                                    {
                                        item.arr?.map((c, idx) => {
                                            return (
                                                <li key={idx}>
                                                    <h4>{c.label}</h4>
                                                    <p>{c.description}</p>
                                                </li>
                                            )
                                        })
                                    }
                                </ul>}
                                {
                                    item.desc
                                }
                            </Accordion.Body>
                        </Accordion.Item>
                    )
                })
            }
        </Accordion>
    )
}


