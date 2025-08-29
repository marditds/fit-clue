import { Button, Form, FormText } from 'react-bootstrap';
import { LoadingComponent } from '../Loading/Loading';
import { Icon } from '../Accessories/Icon';
// import { Link } from 'react-router-dom';

export const SearchForm = ({ searchTerm, setSearchTerm, searchFieldPlacement, className, isLoading, placeholder }) => {
    return (
        <>
            <Form.Control
                id={`searchIn${searchFieldPlacement}`}
                type='search'
                className={`me-2 ${className || ''} border`}
                placeholder={`Search${placeholder ? ` ` + placeholder : ''}`}
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

            {/* <Link to='/advanced-search' className='ms-2'>
                <Form.Text >
                    Advanced Search
                </Form.Text>
            </Link> */}
        </>
    )
}
