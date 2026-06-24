import React from 'react';
import { Image } from 'react-bootstrap';
import aboutImg from '../../assets/about.jpg';
import { useBreakpoints } from '../../lib/hooks/useBreakpoints';

export const Graphics = () => {

    const { isXs, isSm, isMd } = useBreakpoints();

    const isScreenMedOrLess = isXs || isSm || isMd;

    return (
        <figure className='mb-5'>
            <Image
                src={aboutImg} height={isScreenMedOrLess ? 180 : 360}
                className=' object-fit-cover'
                width={'100%'}
                style={{ objectPosition: 'top' }}
            />
        </figure>
    )
}
