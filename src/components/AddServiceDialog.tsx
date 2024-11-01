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
}

const AddServiceDialog: React.FC<AddServiceDialogProps> = ({ open, onClose, onAddService }) => {
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [clientId, setClientId] = useState('');
    const [date, setDate] = useState('');
    const [clients, setClients] = useState<Client[]>([]);

    useEffect(() => {
        const fetchClients = async () => {
            const clientsData = await getClients();
            setClients(clientsData);
        };
        fetchClients();
    }, []);

    const handleAdd = () => {
        if (description.trim() === '' || !clientId || !price || !date) return;
        onAddService({
            description,
            clientId,
            price: parseFloat(price),
            date: new Date(date),
        });
        setDescription('');
        setPrice('');
        setClientId('');
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
                        value={clientId}
                        label="Client"
                        onChange={(e) => setClientId(e.target.value)}
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
