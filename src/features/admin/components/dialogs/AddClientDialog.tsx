import React, {useState} from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField} from '@mui/material';
import {useTranslation} from 'react-i18next';
import {Client} from '../../../shared/types';

interface AddClientDialogProps {
    open: boolean;
    onClose: () => void;
    onAddClient: (client: Omit<Client, 'id'>) => void;
}

const AddClientDialog: React.FC<AddClientDialogProps> = ({open, onClose, onAddClient}) => {
    const {t} = useTranslation();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');

    const handleAdd = () => {
        if (name.trim() === '') {
            console.warn(t('name') + ' ' + t('isRequired'));
            return;
        }
        onAddClient({name, phone, email});
        setName('');
        setPhone('');
        setEmail('');
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{t('addClient')}</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label={t('name')}
                    type="text"
                    fullWidth
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <TextField
                    margin="dense"
                    label={t('phone')}
                    type="tel"
                    fullWidth
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />
                <TextField
                    margin="dense"
                    label={t('email')}
                    type="email"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>{t('cancel')}</Button>
                <Button onClick={handleAdd} variant="contained" color="primary">
                    {t('add')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddClientDialog;