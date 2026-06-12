import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button, Form, ToggleButton } from 'react-bootstrap';
import { LoadingComponent } from '../Loading/Loading';
import { Icon } from '../Accessories/Icon';
import { useBreakpoints } from '../../lib/hooks/useBreakpoints';
import { IconAdjustments, IconAdjustmentsFilled, IconHanger } from '@tabler/icons-react';
import { devLog } from '../../lib/utils/devConsole';

export const SearchField = ({ searchTerm, setSearchTerm, searchFieldPlacement, className, isLoading, placeholder }) => {
    return (
        <>
            <Form.Control
                id={`searchIn${searchFieldPlacement}`}
                type='search'
                className={`me-2 me-sm-3 ${className || ''} border`}
                placeholder={`Search${placeholder ? ` ` + placeholder + '...' : ''}`}
                aria-label='Search'
                value={searchTerm || ''}
                onChange={(e) => {
                    devLog('Search term in navbar:', e.target.value);
                    setSearchTerm(e.target.value)
                }}
                autoFocus
            />
            <Button
                type='submit'
                disabled={!searchTerm}
                style={{ minHeight: '31px' }}
            >
                {!isLoading ? <Icon className='bi bi-search' /> : <LoadingComponent loadingText={' '} />}
            </Button>
        </>
    )
}

export const SearchComponent = ({ onSubmit, formClassName, searchTerm, isResultsLoading, setSearchTerm, params, resultsTotal, searchCategory, setSearchCategory }) => {

    const location = useLocation();

    const { isXs, isSm, isMd } = useBreakpoints();

    const isScreenLargeAndLarger = !isXs && !isSm && !isMd;

    const [showCategories, setShowCategories] = useState(false || location.pathname === '/search');

    useEffect(() => {
        if (location.pathname !== '/search') {
            setShowCategories(false);
        }
    }, [location.pathname])

    const searchCategories = [
        {
            name: 'Personality',
            value: 'personality',
            icon: <Icon className='bi bi-person me-0 me-sm-2' />,
            id: '1'
        },
        {
            name: 'Item',
            value: 'item',
            icon: <IconHanger stroke={1.25} size={20} className='me-0 me-sm-2' />,
            id: '2'
        },
        {
            name: 'Brand',
            value: 'brand',
            icon: <Icon className='bi bi-tag me-0 me-sm-2' />,
            id: '3'
        }
    ]

    return (
        <Form
            onSubmit={onSubmit}
        >
            {/* Search bar */}
            <div className='d-flex justify-content-center'>
                <SearchField
                    searchFieldPlacement='ResultsPage'
                    searchTerm={searchTerm}
                    isLoading={isResultsLoading}
                    setSearchTerm={setSearchTerm}
                    placeholder={searchCategory}
                />
            </div>

            {/*  Results count and options btn */}
            <div className='mt-2 mt-sm-3 w-100 d-flex algin-items-center'>
                {
                    !location.pathname.startsWith('/search/') ? null :
                        <Form.Text className='d-flex align-items-center mt-0'>
                            Found {resultsTotal} result{resultsTotal > 1 ? 's' : ''}
                        </Form.Text>
                }
                <Button
                    onClick={() => setShowCategories(preVal => !preVal)}
                    className='ms-auto d-flex justify-content-center align-items-center '
                >
                    {!showCategories ?
                        <IconAdjustments stroke={1} className={`slider-icon ${isScreenLargeAndLarger ? 'me-2' : 'me-2'}`} /> :
                        <IconAdjustmentsFilled className={`slider-icon ${isScreenLargeAndLarger ? 'me-2' : 'me-2'}`} />
                    }
                    Search Options
                    {/* {isScreenLargeAndLarger && 'Search Options'} */}
                </Button>
            </div>

            {/* Categories */}
            {showCategories &&
                <div className='styled-radio mt-2 mt-sm-3 d-flex align-items-center justify-content-end'>
                    <h6 className='mb-0 me-2 me-sm-3'>
                        Search By:
                    </h6>

                    {
                        searchCategories.map((category, idx) => {
                            return (
                                <ToggleButton
                                    key={idx}
                                    name='searchCategories'
                                    type='radio'
                                    id={`inline-radio-${category.id}`}
                                    value={category.value}
                                    checked={searchCategory === category.value}
                                    onChange={(e) => setSearchCategory(e.target.value)}
                                >
                                    {category.icon}
                                    {category.name}
                                </ToggleButton>
                            )
                        })
                    }
                </div>
            }
        </Form>
    )
}
