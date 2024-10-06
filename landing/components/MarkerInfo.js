import React, { useEffect, useState } from 'react';
import {
    ListItemText,
    Checkbox,
    Box,
    Typography,
    List,
    ListItem,
    Stack,
    Snackbar,
    Alert,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';

import SubmissionSuccessDialog from './SubmissionSuccessDialog';
import SubmissionFailureDialog from './SubmissionFailureDialog';
import Task from './Task';

export const MarkerInfo = ({ markerId }) => {
    const [selectedTaskIndex, setSelectedTaskIndex] = useState(null);
    const [taskDetails, setTaskDetails] = useState({});
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [markerInfo, setMarkerInfo] = useState([]);
    const [loadingMarkers, setLoadingMarkers] = useState(true);
    const [markersError, setMarkersError] = useState('');
    const [isSubmittedDialogOpen, setIsSubmittedDialogOpen] = useState(false)
    const [isFailureDialogOpen, setIsFailureDialogOpen] = useState(false)

    const fetchMarkerInfo = async () => {
        try {
            const response = await fetch(
                `http://localhost:8000/get_marker_info?marker_id=${markerId}`
            );
            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            console.log(data);
            setMarkerInfo(data);
        } catch (error) {
            console.error('Failed to fetch markers:', error);
            setMarkersError('Failed to load markers.');
        } finally {
            setLoadingMarkers(false);
        }
    };

    useEffect(() => {
        fetchMarkerInfo();
    }, [markerId]);

    const handleTaskToggle = (taskIndex) => {
        setSelectedTaskIndex((prevIndex) =>
            prevIndex === taskIndex ? null : taskIndex
        );
    };

    const handleDescriptionChange = (taskIndex, description) => {
        setTaskDetails((prevDetails) => ({
            ...prevDetails,
            [taskIndex]: {
                ...prevDetails[taskIndex],
                description: description,
            },
        }));
    };

    const handleImageUpload = (taskIndex, type, file) => {
        const imageUrl = URL.createObjectURL(file);

        const previousUrl = taskDetails[taskIndex]?.[`${type}Url`];
        if (previousUrl) {
            URL.revokeObjectURL(previousUrl);
        }

        setTaskDetails((prevDetails) => ({
            ...prevDetails,
            [taskIndex]: {
                ...prevDetails[taskIndex],
                [type]: file,
                [`${type}Url`]: imageUrl,
            },
        }));

        setSnackbarMessage(
            `${type === 'beforeImage' ? 'Before' : 'After'
            } image uploaded successfully.`
        );
        setSnackbarOpen(true);
    };

    const handleImageRemove = (taskIndex, type) => {
        const imageUrl = taskDetails[taskIndex]?.[`${type}Url`];
        if (imageUrl) {
            URL.revokeObjectURL(imageUrl);
        }

        setTaskDetails((prevDetails) => {
            const newTaskDetails = { ...prevDetails };
            if (newTaskDetails[taskIndex]) {
                delete newTaskDetails[taskIndex][type];
                delete newTaskDetails[taskIndex][`${type}Url`];
            }
            return newTaskDetails;
        });
    };

    const handleSubmit = async (taskIndex) => {
        const taskData = taskDetails[taskIndex];
        const task = markerInfo.incompleted_tasks[taskIndex];

        const formData = new FormData();

        formData.append('description', taskData.description);

        if (taskData.beforeImage) {
            formData.append('beforeImage', taskData.beforeImage);
        }
        if (taskData.afterImage) {
            formData.append('afterImage', taskData.afterImage);
        }

        formData.append('markerId', markerId);
        formData.append('taskId', task.task_id);
        formData.append('userId', 'userid123');

        try {
            const response = await fetch('http://localhost:8000/add_task', {
                method: 'POST',
                body: formData,
            });

            if (response.status === 200) {
                const res = await response.json();

                if (res['answer'] === 'No') {
                    setIsFailureDialogOpen(true);
                } else {
                    await fetchMarkerInfo();

                    setSelectedTaskIndex(null);
                    setTaskDetails((prevDetails) => {
                        const newDetails = { ...prevDetails };
                        delete newDetails[taskIndex];
                        return newDetails;
                    });

                    setIsSubmittedDialogOpen(true);
                }
            } else {
                throw new Error('Submission failed');
            }
        } catch (error) {
            console.error('Submission failed:', error);
            setSnackbarMessage('Failed to submit the task.');
            setSnackbarOpen(true);
        }
    };

    useEffect(() => {
        return () => {
            Object.values(taskDetails).forEach((taskDetail) => {
                if (taskDetail.beforeImageUrl) {
                    URL.revokeObjectURL(taskDetail.beforeImageUrl);
                }
                if (taskDetail.afterImageUrl) {
                    URL.revokeObjectURL(taskDetail.afterImageUrl);
                }
            });
        };
    }, [taskDetails]);

    const handleDialogClose = () => {
        setIsSubmittedDialogOpen(false);
        setIsFailureDialogOpen(false)
    };

    return (
        <Stack p={2}>
            <Box sx={{ padding: 3 }}>
                <Typography variant="h4" gutterBottom>
                    {markerInfo.description}
                </Typography>

                <Typography variant="h6" gutterBottom>
                    TASKS DONE
                </Typography>
                <List>
                    {markerInfo.completed_tasks?.map((task, index) => (
                        <ListItem key={`done-${index}`}>
                            <Checkbox
                                edge="start"
                                checked
                                checkedIcon={<CheckCircleIcon style={{ color: 'green' }} />}
                                disableRipple
                            />
                            <ListItemText
                                primary={task.task_name}
                                primaryTypographyProps={{ style: { color: 'green' } }}
                            />
                        </ListItem>
                    ))}
                </List>

                <Typography variant="h6" gutterBottom>
                    Tasks to be done:
                </Typography>
                <List>
                    {markerInfo.incompleted_tasks?.map((task, index) => (
                        <Stack key={`task-${index}`}>
                            <ListItem>
                                <Checkbox
                                    edge="start"
                                    checked={selectedTaskIndex === index}
                                    icon={
                                        <RadioButtonUncheckedIcon style={{ color: 'red' }} />
                                    }
                                    checkedIcon={
                                        <RadioButtonCheckedIcon style={{ color: 'red' }} />
                                    }
                                    onChange={() => handleTaskToggle(index)}
                                />
                                <ListItemText
                                    primary={task.task_name}
                                    primaryTypographyProps={{ style: { color: 'red' } }}
                                />
                            </ListItem>

                            {selectedTaskIndex === index && (
                                <Task
                                    taskIndex={index}
                                    taskDetails={taskDetails}
                                    handleDescriptionChange={handleDescriptionChange}
                                    handleImageUpload={handleImageUpload}
                                    handleImageRemove={handleImageRemove}
                                    handleSubmit={handleSubmit}
                                />
                            )}
                        </Stack>
                    ))}
                </List>
            </Box>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setSnackbarOpen(false)}
                    severity="success"
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>

            <SubmissionSuccessDialog
                open={isSubmittedDialogOpen}
                onClose={handleDialogClose}
            />

            <SubmissionFailureDialog
                open={isFailureDialogOpen}
                onClose={handleDialogClose}
            />

        </Stack>
    );
};

export default MarkerInfo;
