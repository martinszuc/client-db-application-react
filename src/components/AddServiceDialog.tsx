import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
    Button,
    MenuItem,
    InputLabel,
    Select,
    FormControl,
} from '@mui/material';
import { Service, Client } from '../types/types';
import { getClients } from '../services/firestoreService';

interface AddServiceDialogProps {
    open: boolean;
    onClose: () => void;
    onAddService: (service: Omit<Service, 'id'>) => void;
    clientId?: string; // This is the prop passed from parent
}

const AddServiceDialog: React.FC<AddServiceDialogProps> = ({ open, onClose, onAddService, clientId }) => {
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [selectedClientId, setSelectedClientId] = useState(clientId || ''); // Renamed from clientId to selectedClientId
    const [date, setDate] = useState('');
    const [clients, setClients] = useState<Client[]>([]);

    useEffect(() => {
        if (clientId) {
            setSelectedClientId(clientId); // Use selectedClientId
        }
    }, [clientId]);

    useEffect(() => {
        const fetchClients = async () => {
            const clientsData = await getClients();
            setClients(clientsData);
        };
        fetchClients();
    }, []);

    const handleAdd = () => {
        if (description.trim() === '' || !selectedClientId || !price || !date) return;
        onAddService({
            description,
            clientId: selectedClientId, // Pass selectedClientId instead of clientId
            price: parseFloat(price),
            date: new Date(date),
        });
        setDescription('');
        setPrice('');
        setSelectedClientId('');
        setDate('');
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Add Service</DialogTitle>
            <DialogContent>
                <FormControl fullWidth margin="dense">
                    <InputLabel id="client-label">Client</InputLabel>
                    <Select
                        labelId="client-label"
                        value={selectedClientId} // Use selectedClientId
                        label="Client"
                        onChange={(e) => setSelectedClientId(e.target.value as string)} // Use selectedClientId
                    >
                        {clients.map((client) => (
                            <MenuItem key={client.id} value={client.id}>
                                {client.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    margin="dense"
                    label="Description"
                    type="text"
                    fullWidth
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <TextField
                    margin="dense"
                    label="Price"
                    type="number"
                    fullWidth
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />
                <TextField
                    margin="dense"
                    label="Date"
                    type="date"
                    fullWidth
                    required
                    InputLabelProps={{
                        shrink: true,
                    }}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleAdd} variant="contained" color="primary">
                    Add
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddServiceDialog;
