export const LoadingComponent = ({ loadingText }) => {

    return (
        <div className='d-flex justify-content-center align-items-center'>
            {!loadingText ? 'Loading' : loadingText}
            <i className='bi bi-dot loading__i d-flex justify-content-center align-items-center' />
            <i className='bi bi-dot loading__i d-flex justify-content-center align-items-center' />
            <i className='bi bi-dot loading__i d-flex justify-content-center align-items-center' />

        </div>
    );
};

export const LoadingPage = ({ loadingText }) => {

    return (
        <div
            className='d-flex justify-content-center align-items-center'
            style={{
                minHeight: 'calc(100vh - 112px)'
            }}
        >
            {!loadingText ? 'Loading' : loadingText}
            <i className='bi bi-dot loading__i d-flex justify-content-center align-items-center' />
            <i className='bi bi-dot loading__i d-flex justify-content-center align-items-center' />
            <i className='bi bi-dot loading__i d-flex justify-content-center align-items-center' />

        </div>
    );
};