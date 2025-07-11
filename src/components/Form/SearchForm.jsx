import { Button, Form } from 'react-bootstrap';
import { LoadingComponent } from '../Loading/Loading';

export const SearchForm = ({ searchTerm, setSearchTerm, searchFieldPlacement, className, isLoading }) => {
    return (
        <>
            <Form.Control
                id={`searchIn${searchFieldPlacement}`}
                type='search'
                placeholder='Search'
                className={`me-2 ${className || ''}`}
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
                {!isLoading ? 'Search' : <LoadingComponent loadingText={' '} />}
            </Button>
        </>
    )
}
