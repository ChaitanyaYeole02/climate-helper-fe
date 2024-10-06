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

const SubmissionSuccessDialog = ({ open, onClose }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                <EnergySavingsLeafIcon color="success" sx={{ mr: 1 }} />
                Thank You!
            </DialogTitle>
            <DialogContent>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        You have reduced <strong>20g CO₂</strong> from this place.
                    </Typography>
                    <Typography variant="body1">
                        Thank you for helping make the environment better!
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

export default SubmissionSuccessDialog;
