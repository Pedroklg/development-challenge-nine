import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { Box } from '@mui/material';


export interface DeleteDialogProps {
    open: boolean;
    handleClose: () => void;
    handleAccept: () => void;
}

function DeleteDialog(props: DeleteDialogProps) {
    const { handleClose, handleAccept, open } = props;

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>Tem certeza que deseja excluir esse paciente?</DialogTitle>
            <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', pb: 2 }}>
                <Button onClick={handleAccept} variant='contained' color="error">Excluir</Button>
                <Button onClick={handleClose} variant='contained' color="inherit">Cancelar</Button>
            </Box>
        </Dialog>
    );
}

export default DeleteDialog;