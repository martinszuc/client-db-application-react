// src/components/AddServiceDialog.tsx

import React, { useEffect, useState } from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Service } from '../../../shared/types/Service';
import { Client } from '../../../shared/types/Client';
import { ClientRepository } from '../../../../api/repositories/ClientRepository';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../../../../app/assets/styles/reactQuill.css'; // Import the custom CSS
import { useTheme } from '@mui/material/styles';
import logger from '../../../../utils/logger'; // Import the logger

interface AddServiceDialogProps {
    open: boolean;
    onClose: () => void;
    onAddService: (service: Omit<Service, 'id'>) => void;
    clientId?: string; // Optional pre-selected client ID
}

const clientRepository = new ClientRepository();

const AddServiceDialog: React.FC<AddServiceDialogProps> = ({
                                                               open,
                                                               onClose,
                                                               onAddService,
                                                               clientId,
                                                           }) => {
    const { t } = useTranslation();
    const theme = useTheme(); // Access Material UI theme
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [selectedClientId, setSelectedClientId] = useState(clientId || '');
    const [date, setDate] = useState('');
    const [clients, setClients] = useState<Client[]>([]);
    const [loadingClients, setLoadingClients] = useState<boolean>(false);

    useEffect(() => {
        if (clientId) {
            setSelectedClientId(clientId);
            logger.info(`AddServiceDialog: Pre-selected client ID: ${clientId}`);
        }
    }, [clientId]);

    useEffect(() => {
        const fetchClients = async () => {
            setLoadingClients(true);
            logger.info('AddServiceDialog: Fetching clients');
            try {
                const clientsData = await clientRepository.getClients();
                setClients(clientsData);
                logger.info(`AddServiceDialog: Fetched ${clientsData.length} clients`);
            } catch (error) {
                console.error(t('errorFetchingClients'), error);
                logger.error('AddServiceDialog: Error fetching clients', { error });
            } finally {
                setLoadingClients(false);
                logger.info('AddServiceDialog: Finished fetching clients');
            }
        };
        fetchClients();
    }, [t]);

    useEffect(() => {
        // Set dynamic theme variables
        const root = document.documentElement;
        root.style.setProperty('--editor-bg-color', theme.palette.background.paper);
        root.style.setProperty('--editor-text-color', theme.palette.text.primary);
        root.style.setProperty('--editor-border-color', theme.palette.divider);
        root.style.setProperty('--editor-toolbar-bg-color', theme.palette.background.default);
        root.style.setProperty('--editor-toolbar-icon-color', theme.palette.text.secondary);
        logger.info('AddServiceDialog: Updated editor theme variables');
    }, [theme]);

    const handleAdd = () => {
        if (!name.trim() || !description.trim() || !selectedClientId || !price || !date) {
            console.warn(t('allFieldsRequired'));
            logger.warn('AddServiceDialog: Attempted to add service with missing fields');
            return;
        }

        const serviceData: Omit<Service, 'id'> = {
            name,
            description,
            clientId: selectedClientId,
            price: parseFloat(price),
            date: new Date(date),
        };

        logger.info('AddServiceDialog: Adding new service', { serviceData });
        onAddService(serviceData);

        setName('');
        setDescription('');
        setPrice('');
        setSelectedClientId('');
        setDate('');

        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>{t('addService')}</DialogTitle>
            <DialogContent>
                <TextField
                    margin="dense"
                    label={t('serviceName')}
                    type="text"
                    fullWidth
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <FormControl fullWidth margin="dense" disabled={loadingClients}>
                    <InputLabel id="client-label">{t('client')}</InputLabel>
                    <Select
                        labelId="client-label"
                        value={selectedClientId}
                        onChange={(e) => setSelectedClientId(e.target.value as string)}
                        label={t('client')}
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
                    label={t('price')}
                    type="number"
                    fullWidth
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />
                <TextField
                    margin="dense"
                    label={t('date')}
                    type="date"
                    fullWidth
                    required
                    InputLabelProps={{
                        shrink: true,
                    }}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />

                <Typography variant="body2" style={{ marginTop: '16px' }}>
                    {t('description')}
                </Typography>
                <ReactQuill
                    theme="snow"
                    value={description}
                    onChange={setDescription}
                    style={{ height: '200px', marginBottom: '50px' }}
                />
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={() => {
                        logger.info('AddServiceDialog: Cancel button clicked');
                        onClose();
                    }}
                >
                    {t('cancel')}
                </Button>
                <Button
                    onClick={handleAdd}
                    variant="contained"
                    color="primary"
                    disabled={!name || !description || !selectedClientId || !price || !date}
                >
                    {t('add')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddServiceDialog;
