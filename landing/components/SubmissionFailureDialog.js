import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
} from '@mui/material';
import EnergySavingsLeafIcon from '@mui/icons-material/EnergySavingsLeaf';

const SubmissionFailureDialog = ({ open, onClose }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                <EnergySavingsLeafIcon color="error" sx={{ mr: 1 }} />
                Error!
            </DialogTitle>
            <DialogContent>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Your description did not fit with the images provided.
                    </Typography>
                    <Typography variant="body1">
                        Please try submitting again!
                    </Typography>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary" variant="contained">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default SubmissionFailureDialog;
