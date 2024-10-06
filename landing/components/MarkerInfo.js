import React, { useState } from 'react';
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

import Task from './Task';

const tasks = ['Task 1', 'Task 2', 'Task 3'];

export const MarkerInfo = ({ markerId }) => {
    const [selectedTaskIndex, setSelectedTaskIndex] = useState(null);
    const [taskDetails, setTaskDetails] = useState({});
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const handleTaskToggle = (taskIndex) => {
        setSelectedTaskIndex((prevIndex) => (prevIndex === taskIndex ? null : taskIndex));
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
        setTaskDetails((prevDetails) => ({
            ...prevDetails,
            [taskIndex]: {
                ...prevDetails[taskIndex],
                [type]: file,
            },
        }));

        setSnackbarMessage(`${type === 'beforeImage' ? 'Before' : 'After'} image uploaded successfully.`);
        setSnackbarOpen(true);
    };

    const handleSubmit = () => {
        const taskData = taskDetails[selectedTaskIndex];
        console.log('Submitting task:', taskData);
        // Add your submission logic here
    };

    return (
        <Stack p={2}>
            <Box sx={{ padding: 3 }}>
                <Typography variant="h4" gutterBottom>
                    TIME SQUARE
                </Typography>

                <Typography variant="h6" gutterBottom>
                    TASKS DONE
                </Typography>
                <List>
                    {tasks.map((task, index) => (
                        <ListItem key={`done-${index}`}>
                            <Checkbox
                                edge="start"
                                checked
                                checkedIcon={<CheckCircleIcon style={{ color: 'green' }} />}
                                disableRipple
                            />
                            <ListItemText
                                primary={task}
                                primaryTypographyProps={{ style: { color: 'green' } }}
                            />
                        </ListItem>
                    ))}
                </List>

                <Typography variant="h6" gutterBottom>
                    Overview
                </Typography>

                <Typography variant="h6" gutterBottom>
                    Task's to be done:
                </Typography>
                <List>
                    {tasks.map((task, index) => (
                        <Stack key={`task-${index}`}>
                            <ListItem>
                                <Checkbox
                                    edge="start"
                                    checked={selectedTaskIndex === index}
                                    icon={<RadioButtonUncheckedIcon style={{ color: 'red' }} />}
                                    checkedIcon={<RadioButtonCheckedIcon style={{ color: 'red' }} />}
                                    onChange={() => handleTaskToggle(index)}
                                />
                                <ListItemText
                                    primary={task}
                                    primaryTypographyProps={{ style: { color: 'red' } }}
                                />
                            </ListItem>

                            {selectedTaskIndex === index && (
                                <Task
                                    taskIndex={index}
                                    taskDetails={taskDetails}
                                    handleDescriptionChange={handleDescriptionChange}
                                    handleImageUpload={handleImageUpload}
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
                <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Stack>
    );
};

export default MarkerInfo;
