import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button, Form, ToggleButton } from 'react-bootstrap';
import { LoadingComponent } from '../Loading/Loading';
import { Icon } from '../Accessories/Icon';
import { useBreakpoints } from '../../lib/hooks/useBreakpoints';
import { IconAdjustments, IconAdjustmentsFilled, IconHanger } from '@tabler/icons-react';

export const SearchField = ({ searchTerm, setSearchTerm, searchFieldPlacement, className, isLoading, placeholder }) => {
    return (
        <>
            <Form.Control
                id={`searchIn${searchFieldPlacement}`}
                type='search'
                className={`me-2 me-sm-3 ${className || ''} border`}
                placeholder={`Search${placeholder ? ` ` + placeholder + '...' : ''}`}
                aria-label='Search'
                value={searchTerm}
                onChange={(e) => {
                    console.log('Search term in navbar:', e.target.value);
                    setSearchTerm(e.target.value)
                }}
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

export const SearchComponent = ({ onSubmit, formClassName, searchTerm, isResultsLoading, setSearchTerm, resultsTotal, searchCategory, setSearchCategory }) => {

    const location = useLocation();

    const { isXs, isSm, isMd } = useBreakpoints();

    const isScreenLargeAndLarger = !isXs && !isSm && !isMd;

    const [showCategories, setShowCategories] = useState(false);

    useEffect(() => {
        setShowCategories(false);
    }, [location.pathname])

    return (
        <Form
            onSubmit={onSubmit}
        >
            <div className='d-flex justify-content-center'>
                <SearchField
                    searchFieldPlacement='ResultsPage'
                    searchTerm={searchTerm}
                    isLoading={isResultsLoading}
                    setSearchTerm={setSearchTerm}
                    placeholder={searchCategory}
                />
            </div>

            <div className='mt-2 mt-sm-3 w-100 d-flex algin-items-center'>

                {
                    location.pathname.startsWith('/search') &&
                    <Form.Text className='d-flex align-items-center mt-0'>
                        Found {resultsTotal} result{resultsTotal > 1 ? 's' : ''}
                    </Form.Text>
                }

                <Button
                    onClick={() => setShowCategories(preVal => !preVal)}
                    className='ms-auto d-flex justify-content-center align-items-center '
                >
                    {!showCategories ?
                        <IconAdjustments stroke={1} className={`slider-icon ${isScreenLargeAndLarger ? 'me-2' : 'me-0'}`} /> :
                        <IconAdjustmentsFilled className={`slider-icon ${isScreenLargeAndLarger ? 'me-2' : 'me-0'}`} />
                    }
                    {isScreenLargeAndLarger && 'Search Options'}
                </Button>
            </div>

            {showCategories &&
                <div className='styled-radio mt-2 mt-sm-3 d-flex align-items-center justify-content-end'>
                    <h6 className='mb-0 me-2 me-sm-3'>
                        Search By:
                    </h6>
                    <ToggleButton
                        name='searchCategories'
                        type="radio"
                        id={`inline-radio-1`}
                        value='personality'
                        checked={searchCategory === 'personality'}
                        onChange={(e) => setSearchCategory(e.target.value)}
                    >
                        <Icon className='bi bi-person me-0 me-sm-2' />
                        Personality
                    </ToggleButton>

                    <ToggleButton
                        name='searchCategories'
                        type='radio'
                        id={`inline-radio-2`}
                        value='item'
                        checked={searchCategory === 'item'}
                        onChange={(e) => setSearchCategory(e.target.value)}
                    >
                        <IconHanger stroke={1.25} size={20} className='me-0 me-sm-2' />
                        Item
                    </ToggleButton>

                    {/* <Form.Check
                        inline
                        label={<>
                            <Icon className='bi bi-person fs-5 ms-2' marginEndSize='2' />
                            Personality</>}
                        name='searchCategories'
                        type='radio'
                        id={`inline-radio-1`}
                        value='personality'
                        // className='mb-0'
                        className='mb-0 d-flex justify-content-center align-items-baseline'
                        checked={searchCategory === 'personality'}
                        onChange={(e) => setSearchCategory(e.target.value)}
                    />
                    <Form.Check
                        inline
                        label={<>
                            <IconHanger stroke={1.25} className='me-2' />
                            Item</>}
                        name='searchCategories'
                        type='radio'
                        id={`inline-radio-2`}
                        value='item'
                        className='mb-0'
                        // className='d-flex justify-content-center align-items-center'
                        checked={searchCategory === 'item'}
                        onChange={(e) => setSearchCategory(e.target.value)}
                    /> */}
                </div>
            }
        </Form>
    )
}
