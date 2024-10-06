import React from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const Task = ({
    taskIndex,
    taskDetails,
    handleDescriptionChange,
    handleImageUpload,
    handleImageRemove,
    handleSubmit,
}) => {
    const beforeImage = taskDetails[taskIndex]?.beforeImageUrl;
    const afterImage = taskDetails[taskIndex]?.afterImageUrl;

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

            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 1,
                    marginBottom: 2,
                }}
            >
                {beforeImage ? (
                    <Box sx={{ position: 'relative', display: 'inline-block' }}>
                        <img
                            src={beforeImage}
                            alt="Before"
                            style={{ maxWidth: '100px', maxHeight: '100px' }}
                        />
                        <IconButton
                            size="small"
                            onClick={() => handleImageRemove(taskIndex, 'beforeImage')}
                            sx={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                color: 'white',
                                backgroundColor: 'rgba(0,0,0,0.5)',
                            }}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Box>
                ) : (
                    <Button variant="contained" component="label">
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
                )}

                {afterImage ? (
                    <Box sx={{ position: 'relative', display: 'inline-block' }}>
                        <img
                            src={afterImage}
                            alt="After"
                            style={{ maxWidth: '100px', maxHeight: '100px' }}
                        />
                        <IconButton
                            size="small"
                            onClick={() => handleImageRemove(taskIndex, 'afterImage')}
                            sx={{
                                position: 'absolute',
                                top: 0,
                                right: 0,
                                color: 'white',
                                backgroundColor: 'rgba(0,0,0,0.5)',
                            }}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </Box>
                ) : (
                    <Button variant="contained" component="label">
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
                )}

                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleSubmit(taskIndex)}
                >
                    Submit
                </Button>
            </Box>
        </Box>
    );
};

export default Task;
