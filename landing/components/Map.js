// /components/Map.js
import React, { useMemo, useState, useEffect } from 'react';
import { GoogleMap, useLoadScript, MarkerF, InfoWindow } from '@react-google-maps/api';
import { CircularProgress, Box, Typography } from '@mui/material';
import { NYC_MARKERS } from '../../constants'; // Adjust the path if necessary

const DEFAULT_CENTER = {
    lat: 40.758896, // Times Square, NYC
    lng: -73.985130,
};

const Map = () => {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    });

    const [currentCenter, setCurrentCenter] = useState(DEFAULT_CENTER);
    const [errorMsg, setErrorMsg] = useState('');
    const [activeMarker, setActiveMarker] = useState(null);

    const memoizedMapContainerStyle = useMemo(
        () => ({
            width: '100%',
            height: '80vh',
            minHeight: '300px',
        }),
        []
    );

    const memoizedOptions = useMemo(
        () => ({
            disableDefaultUI: true,
            zoomControl: true,
        }),
        []
    );

    const getStoredLocation = () => {
        const storedLocation = localStorage.getItem('userLocation');
        if (storedLocation) {
            try {
                return JSON.parse(storedLocation);
            } catch (error) {
                console.error('Error parsing stored location:', error);
                return null;
            }
        }
        return null;
    };

    const requestUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const userLocation = { lat: latitude, lng: longitude };
                    console.log('User location obtained:', userLocation);
                    setCurrentCenter(userLocation);
                    localStorage.setItem('userLocation', JSON.stringify(userLocation));
                },
                (error) => {
                    console.error('Error retrieving location:', error);
                    setErrorMsg('Unable to retrieve your location. Using default location.');
                }
            );
        } else {
            setErrorMsg('Geolocation is not supported by your browser.');
        }
    };

    useEffect(() => {
        const storedLocation = getStoredLocation();
        if (storedLocation) {
            console.log('Using stored location:', storedLocation);
            setCurrentCenter(storedLocation);
        } else {
            requestUserLocation();
        }
    }, []);

    useEffect(() => {
        console.log('Updated Current Center:', currentCenter);
    }, [currentCenter]);

    if (loadError) return <div>Error loading maps</div>;
    if (!isLoaded)
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="400px">
                <CircularProgress />
            </Box>
        );

    const handleMarkerClick = (markerId) => {
        setActiveMarker(markerId);
    };

    const handleInfoWindowClose = () => {
        setActiveMarker(null);
    };

    return (
        <Box>
            {errorMsg && (
                <Box mb={2} textAlign="center">
                    <Typography variant="body1" color="error">
                        {errorMsg}
                    </Typography>
                </Box>
            )}

            <GoogleMap
                mapContainerStyle={memoizedMapContainerStyle}
                zoom={14}
                center={currentCenter}
                options={memoizedOptions}
            >
                <MarkerF position={currentCenter} />

                {NYC_MARKERS.map((marker) => (
                    <MarkerF
                        key={marker.id}
                        position={marker.position}
                        title={marker.title}
                        icon={{
                            url: '/images/tree.png',
                            scaledSize: new window.google.maps.Size(40, 40),
                        }}
                        onClick={() => handleMarkerClick(marker.id)}
                    />
                ))}
            </GoogleMap>
        </Box>
    );
};

export default Map;
