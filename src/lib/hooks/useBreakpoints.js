import { useEffect, useState } from 'react';

export const useBreakpoints = () => {
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return {
        isXs: width < 576,
        isSm: width >= 576 && width < 768,
        isMd: width >= 768 && width < 992,
        isLg: width >= 992 && width < 1200,
        isXl: width >= 1200 && width < 1400,
        isXxl: width >= 1400
    };
};