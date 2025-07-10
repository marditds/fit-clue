import { Button, Form } from 'react-bootstrap';

export const SearchForm = ({ searchTerm, setSearchTerm, searchFieldPlacement }) => {
    return (
        <>
            <Form.Control
                id={`searchIn${searchFieldPlacement}`}
                type='search'
                placeholder='Search'
                className='me-2'
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
            >
                Search
            </Button>
        </>
    )
}
