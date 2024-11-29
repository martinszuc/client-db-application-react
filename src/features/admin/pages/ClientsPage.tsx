// src/pages/ClientsPage.tsx
import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Container, Fab, Typography,} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import {useTranslation} from 'react-i18next';
import {Client} from '../../shared/types';
import {ClientRepository} from '../../../api/repositories/ClientRepository';
import AddClientDialog from '../components/dialogs/AddClientDialog';
import ClientItem from '../components/items/ClientItem';

const clientRepo = new ClientRepository();

const ClientsPage: React.FC = () => {
    const { t } = useTranslation();
    const [clients, setClients] = useState<Client[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [loadingClients, setLoadingClients] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchClients = async () => {
            setLoadingClients(true);
            try {
                const clientsData = await clientRepo.getClients();
                setClients(clientsData);
            } catch (error) {
                console.error(t('errorFetchingClients'), error);
            } finally {
                setLoadingClients(false);
            }
        };
        fetchClients();
    }, [t]);

    const handleAddClient = async (client: Omit<Client, 'id'>) => {
        try {
            await clientRepo.addClient(client);
            const updatedClients = await clientRepo.getClients();
            setClients(updatedClients);
        } catch (error) {
            console.error(t('errorAddingClient'), error);
        }
    };

    const handleClientClick = (clientId: string) => {
        navigate(`/clients/${clientId}`);
    };

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                {t('clients')}
            </Typography>
            {loadingClients ? (
                <Typography>{t('loadingClients')}</Typography>
            ) : clients.length > 0 ? (
                <div>
                    {clients.map((client) => (
                        <ClientItem
                            key={client.id}
                            client={client}
                            onClick={handleClientClick}
                        />
                    ))}
                </div>
            ) : (
                <Typography>{t('noClientsFound')}</Typography>
            )}
            <Fab
                color="primary"
                aria-label="add"
                onClick={() => setOpenDialog(true)}
                style={{ position: 'fixed', bottom: 80, right: 16 }}
            >
                <AddIcon />
            </Fab>
            <AddClientDialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                onAddClient={handleAddClient}
            />
        </Container>
    );
};

export default ClientsPage;
