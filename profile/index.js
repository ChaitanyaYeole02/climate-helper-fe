import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import {
    Container,
    Box,
    Typography,
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Divider,
    Paper,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import EnergySavingsLeafIcon from '@mui/icons-material/EnergySavingsLeaf';
import ForestIcon from '@mui/icons-material/Forest';

const tasksCompleted = [
    {
        id: 1,
        taskName: 'Planting Trees',
        location: 'Central Park',
        pointsEarned: 50,
        dateCompleted: '2023-10-01',
    },
    {
        id: 2,
        taskName: 'Beach Cleanup',
        location: 'Brighton Beach',
        pointsEarned: 30,
        dateCompleted: '2023-09-20',
    },
    {
        id: 3,
        taskName: 'Recycling Drive',
        location: 'Brooklyn',
        pointsEarned: 20,
        dateCompleted: '2023-09-15',
    },
];

const ProfilePage = () => {
    const [loadingTasks, setLoadingTasks] = useState(true);
    const [tasksError, setTasksError] = useState('');
    const [taskInfo, setTaskInfo] = useState([]);

    const fetchTaskInfo = async () => {
        try {
            const response = await fetch(
                `http://localhost:8000/get_user_tasks?user_id=userid123`
            );
            if (!response.ok) {
                throw new Error(`Error: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            console.log(data);
            setTaskInfo(data);
        } catch (error) {
            console.error('Failed to fetch markers:', error);
            setTasksError('Failed to load markers.');
        } finally {
            setLoadingTasks(false);
        }
    };

    useEffect(() => {
        fetchTaskInfo();
    }, []);

    const totalPoints = taskInfo.reduce((acc, task) => acc + task.points, 0);
    return (
        <>
            <Head>
                <title>Earth Helper - Profile</title>
                <meta name="description" content="User Profile - Earth Helper" />
                <link rel="icon" href="/images/favicon.ico" />
            </Head>
            <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
                <Paper elevation={3} sx={{ p: 4, backgroundColor: '#e8f5e9' }}>
                    <Grid container spacing={4} alignItems="center">
                        <Grid item>
                            <Avatar
                                alt="User Avatar"
                                sx={{ width: 120, height: 120 }}
                            />
                        </Grid>
                        <Grid item>
                            <Typography variant="h4" component="h1" gutterBottom color="textPrimary">
                                Quynh
                            </Typography>
                            <Typography variant="h6" color="textSecondary">
                                Earth Helper Member
                            </Typography>
                        </Grid>
                    </Grid>
                    <Box sx={{ mt: 4 }}>
                        <Typography variant="h5" gutterBottom color="textPrimary">
                            Total <EnergySavingsLeafIcon sx={{ fontSize: 20, color: 'green' }} /> Earned: <strong>{totalPoints}</strong>
                        </Typography>
                    </Box>
                    <Box sx={{ mt: 4 }}>
                        <Typography variant="h5" gutterBottom color="textPrimary">
                            Tasks Completed
                        </Typography>
                        <Divider />
                        <List>
                            {taskInfo.map((task) => (
                                <ListItem key={task.index}>
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: '#66bb6a' }}>
                                            <ForestIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={task.task_name}
                                        secondary={
                                            <>
                                                <Typography component="span" variant="body2" color="textPrimary">
                                                    Location: {task.location}
                                                </Typography>
                                                <br />
                                                <br />
                                                <Typography component="span" variant="body2" color="textPrimary">
                                                    Points Earned: {task.points}
                                                </Typography>
                                            </>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                </Paper>
            </Container>
        </>
    );
};

export default ProfilePage;
