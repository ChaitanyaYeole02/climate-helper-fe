import React from 'react';
import Head from 'next/head';
import { Container, Box, Typography } from '@mui/material';
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('./components/Map'), { ssr: false });

const LandingPage = () => {
    return (
        <>
            <Head>
                <title>Earth Helper</title>
                <meta name="description" content="Earth Helper" />
                <link rel="icon" href="/images/favicon.ico" />
            </Head>
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Welcome to Earth Helper
                    </Typography>
                    <Typography variant="body1">
                        Explore the world with our interactive map.
                    </Typography>
                </Box>
                <Box>
                    <Map />
                </Box>
            </Container>
        </>
    );
};

export default LandingPage;
