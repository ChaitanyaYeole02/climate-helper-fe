import React, { useMemo, useState, useEffect } from 'react';
import { GoogleMap, useLoadScript, MarkerF } from '@react-google-maps/api';
import { useRouter } from 'next/router';
import {
    Button,
    CircularProgress,
    Box,
    Typography,
    Slide,
    Stack,
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
    Alert,
    Snackbar,
    TextField,
    Avatar
} from '@mui/material';
import Grid from '@mui/material/Grid2';

import { NYC_MARKERS } from '../../constants';
import MarkerInfo from './MarkerInfo';
import Task from './Task';

const DEFAULT_CENTER = {
    lat: 0,
    lng: 0,
};

export const Map = () => {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    });

    const router = useRouter();

    const [currentCenter, setCurrentCenter] = useState(DEFAULT_CENTER);
    const [errorMsg, setErrorMsg] = useState('');
    const [activeMarker, setActiveMarker] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [taskDetails, setTaskDetails] = useState({});
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [locationName, setLocationName] = useState('');
    const [markers, setMarkers] = useState([]);
    const [loadingMarkers, setLoadingMarkers] = useState(true);
    const [markersError, setMarkersError] = useState('');


    useEffect(() => {
        const fetchMarkers = async () => {
            try {
                const response = await fetch('http://localhost:8000/get_markers');
                if (!response.ok) {
                    throw new Error(`Error: ${response.status} ${response.statusText}`);
                }
                const data = await response.json();
                console.log(data)
                setMarkers(data);
            } catch (error) {
                console.error('Failed to fetch markers:', error);
                setMarkersError('Failed to load markers.');
            } finally {
                setLoadingMarkers(false);
            }
        };

        fetchMarkers();
    }, []);


    const handleNameChange = (locName) => {
        setLocationName(locName)
    }

    const handleDescriptionChange = (description) => {
        setTaskDetails((prevDetails) => ({
            ...prevDetails,
            description: description,
        }));
    };

    const handleImageUpload = (type, file) => {
        setTaskDetails((prevDetails) => ({
            ...prevDetails,
            [type]: file,
        }));

        setSnackbarMessage(`${type === 'beforeImage' ? 'Before' : 'After'} image uploaded successfully.`);
        setSnackbarOpen(true);
    };

    const handleSubmit = () => {
        console.log('Submitting task:', taskDetails, locationName);
        setIsAddDialogOpen(false);
    };

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

    if (loadError) return <div>Error loading maps</div>;
    if (!isLoaded)
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="400px">
                <CircularProgress />
            </Box>
        );

    const openMarkerInfo = (markerId) => {
        setActiveMarker(markerId);
        setIsDrawerOpen(true);
    };

    const handleAddButtonClick = (location) => {
        setIsAddDialogOpen(true)
    };

    const handleAddDialogClose = () => {
        setIsAddDialogOpen(false)
    }

    const handleProfileClick = () => {
        router.push('/profile');
    };

    return (
        <Stack position="relative">
            {errorMsg && (
                <Box mb={2} textAlign="center">
                    <Typography variant="body1" color="error">
                        {errorMsg}
                    </Typography>
                </Box>
            )}

            <Box style={{ position: 'relative' }} >
                <GoogleMap
                    mapContainerStyle={{
                        width: '100%',
                        height: '80vh',
                        minHeight: '300px',
                    }}
                    zoom={14}
                    center={currentCenter}
                    options={{
                        disableDefaultUI: true,
                    }}
                    onClick={() => setIsDrawerOpen(false)}
                >
                    <MarkerF position={currentCenter} onClick={() => openMarkerInfo(currentCenter)} />

                    {markers.map((marker) => (
                        <MarkerF
                            key={marker.id}
                            position={marker.position}
                            title={marker.title}
                            icon={{
                                url: '/images/tree.png',
                                scaledSize: new window.google.maps.Size(40, 40),
                            }}
                            onClick={() => openMarkerInfo(marker.id)}
                        />
                    ))}
                </GoogleMap>

                <Box position="absolute" top={16} left={16} zIndex="10">
                    <Button variant="contained" color="primary" onClick={() => handleAddButtonClick(currentCenter)}>
                        Add
                    </Button>
                </Box>

                <Box position="absolute" top={16} right={16} zIndex="10">
                    <Avatar
                        alt="Profile Photo"
                        // src="/path/to/profile/photo.jpg"
                        sx={{ cursor: 'pointer' }}
                        href="/profile"
                        onClick={handleProfileClick}
                    />
                </Box>

                <Slide direction="up" in={isDrawerOpen} mountOnEnter unmountOnExit>
                    <Box
                        position="absolute"
                        bottom={0}
                        left={0}
                        width="100%"
                        bgcolor="background.paper"
                        sx={{
                            maxHeight: '40vh',
                            overflowY: 'auto',
                        }}
                    >
                        <MarkerInfo markerId={activeMarker} />
                    </Box>
                </Slide>
            </Box>


            <Dialog open={isAddDialogOpen} onClose={handleAddDialogClose}>
                <DialogTitle>Add New Task</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={4}>
                            <Typography variant="subtitle1">
                                <strong>Name:</strong>
                            </Typography>
                        </Grid>
                        <Grid item xs={8}>
                            <TextField
                                label="Location"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                onChange={(e) => handleNameChange(e.target.value)}
                                sx={{ marginBottom: 2 }}
                            />
                        </Grid>
                        <Task
                            taskDetails={{ 0: taskDetails }}
                            taskIndex={0}
                            handleDescriptionChange={(index, description) => handleDescriptionChange(description)}
                            handleImageUpload={(index, type, file) => handleImageUpload(type, file)}
                            handleSubmit={handleSubmit}
                        />
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleAddDialogClose}>Cancel</Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Stack >
    );
};

export default Map;