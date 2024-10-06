import React from 'react';

import { Box, TextField, Button } from '@mui/material';

const Task = ({
    taskIndex,
    taskDetails,
    handleDescriptionChange,
    handleImageUpload,
    handleSubmit,
}) => {
    return (
        <Box sx={{ paddingLeft: 4, paddingBottom: 2 }}>
            <TextField
                label="Description"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                value={taskDetails[taskIndex]?.description || ''}
                onChange={(e) => handleDescriptionChange(taskIndex, e.target.value)}
                sx={{ marginBottom: 2 }}
            />

            <Button variant="contained" component="label" sx={{ marginRight: 1 }}>
                Upload Before Image
                <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) =>
                        handleImageUpload(taskIndex, 'beforeImage', e.target.files[0])
                    }
                />
            </Button>

            <Button variant="contained" component="label" sx={{ marginRight: 1 }}>
                Upload After Image
                <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) =>
                        handleImageUpload(taskIndex, 'afterImage', e.target.files[0])
                    }
                />
            </Button>

            <Button
                variant="contained"
                color="primary"
                onClick={() => handleSubmit(taskIndex)}
            >
                Submit
            </Button>
        </Box>
    );
};

export default Task;
