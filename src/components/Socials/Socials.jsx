import React from 'react';
import { Icon } from '../Accessories/Icon';
import { socials } from '../../lib/data/socials';

export const Socials = ({ className }) => {
    return (
        <>
            {socials.map((item, idx) => (
                <span key={idx}>
                    <a href={item.link} className='text-decoration-none' target='_blank'>
                        <Icon className={`${item.icon} ${className}`} />
                    </a>
                </span>
            ))
            }
        </>
    )
}
