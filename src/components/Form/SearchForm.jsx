import { Button, Form } from 'react-bootstrap';
import { LoadingComponent } from '../Loading/Loading';
import { Icon } from '../Accessories/Icon';

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
                {!isLoading ? <Icon className='bi bi-search' /> : <LoadingComponent loadingText={' '} />}
            </Button>
        </>
    )
}
