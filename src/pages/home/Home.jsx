import React from 'react';
import Featured from '../../components/Home/Featured';
import { Hero } from '../../components/Home/Hero';
import { NeedsYourHelp } from '../../components/Home/NeedsYourHelp';

const Home = () => {
    return (
        <>
            <Hero />
            <Featured />
            <NeedsYourHelp />
        </>
    )
}

export default Home