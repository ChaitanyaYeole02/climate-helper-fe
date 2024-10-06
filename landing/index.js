import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { Container, Box, Typography, useMediaQuery, useTheme } from '@mui/material';

import Map from './components/Map';

const LandingPage = () => {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <>
            <Head>
                <title>GAIA</title>
                <meta name="description" content="Earth Helper" />
                <link rel="icon" href="/images/favicon.ico" />
            </Head>
            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Box
                    sx={{
                        mb: 4,
                        display: 'flex',
                        flexDirection: isSmallScreen ? 'column' : 'row',
                        alignItems: 'center',
                        justifyContent: isSmallScreen ? 'center' : 'flex-start',
                        gap: 2,
                    }}
                >
                    <Image
                        src="/images/logo.jpeg"
                        alt="GAIA Logo"
                        width={40}
                        height={40}
                        style={{
                            maxWidth: '100%',
                            height: 'auto',
                        }}
                    />
                    <Typography variant="h4" component="h1" gutterBottom>
                        Welcome to GAIA
                    </Typography>
                </Box>

                <Box sx={{ mb: 4, textAlign: isSmallScreen ? 'center' : 'left' }}>
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
