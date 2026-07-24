import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button, Form, ToggleButton } from 'react-bootstrap';
import { LoadingComponent } from '../Loading/Loading';
import { Icon } from '../Accessories/Icon';
import { useBreakpoints } from '../../lib/hooks/useBreakpoints';
import { IconAdjustments, IconAdjustmentsFilled, IconHanger } from '@tabler/icons-react';
import { devLog } from '../../lib/utils/devConsole';
import { capitalizeFirstLetter } from '../../lib/utils/capitalizeLetters';

export const SearchField = ({ searchTerm, setSearchTerm, searchFieldPlacement, className, isLoading, placeholder }) => {
    return (
        <>
            <Form.Control
                id={`searchIn${searchFieldPlacement}`}
                type='search'
                className={`me-2 ${className || ''} border`}
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
            icon: <Icon className='bi bi-person me-2' />,
            id: '1'
        },
        // {
        //     name: 'Item',
        //     value: 'item',
        //     icon: <IconHanger stroke={1.25} size={20} className='me-2' />,
        //     id: '2'
        // },
        {
            name: 'Brand',
            value: 'brand',
            icon: <Icon className='bi bi-tag me-2' />,
            id: '3'
        },
        {
            name: 'IG Link',
            value: 'IG post link',
            icon: <Icon className='bi bi-instagram me-2' />,
            id: '4'
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

            {/*  Results count */}
            <div className='mt-2 w-100 d-flex algin-items-center'>
                {
                    !location.pathname.startsWith('/search/') ? null :
                        <Form.Text className='d-flex align-items-center mt-0'>
                            Found {resultsTotal} result{resultsTotal > 1 ? 's' : ''}
                        </Form.Text>
                }
            </div>

            {/* Search category and options button */}
            <div className='d-flex align-items-center mt-2'>
                <span>
                    {isScreenLargeAndLarger ?
                        `Searching by ${capitalizeFirstLetter(searchCategory)}` :
                        `By ${capitalizeFirstLetter(searchCategory)}`}
                </span>
                <Button
                    onClick={() => setShowCategories(preVal => !preVal)}
                    className='ms-auto d-flex align-items-center'
                >
                    {!showCategories ?
                        <IconAdjustments stroke={1} className={`slider-icon me-2`} /> :
                        <IconAdjustmentsFilled className={`slider-icon me-2`} />
                    }
                    {isScreenLargeAndLarger
                        ? (showCategories ? 'Hide Options' : 'Search Options')
                        : (showCategories ? 'Hide' : 'Options')
                    }
                </Button>
            </div>

            {/* Categories */}
            {showCategories &&
                <div className='styled-radio d-grid gap-2 mt-2 d-md-flex' style={{ gridTemplateColumns: '1fr 1fr' }}>
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
                                    className='d-flex align-items-center'
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
