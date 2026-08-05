import React from 'react';
import { Icon } from '../Accessories/Icon';
import { useBreakpoints } from '../../lib/hooks/useBreakpoints.js';

const UserInfo = ({ username, contributorScore }) => {

    const { isXs, isSm } = useBreakpoints();

    return (
        <>
            <h2 className='mt-0 my-md-2 mb-0'>{username}</h2>
            <div className='d-flex justify-content-center align-items-center'>
                <div className='border tertiary-text-color py-1 px-2 px-md-3 main-border-radius fw-bolder main-bg-color'>
                    <Icon className={'bi bi-star me-2 me-md-0'} />
                    <span className='mx-2 secondary-text-color fw-lighter d-none d-md-inline'>
                        Contribution score
                    </span>
                    {contributorScore}
                </div>
            </div>
        </>
    )
}

export default UserInfo