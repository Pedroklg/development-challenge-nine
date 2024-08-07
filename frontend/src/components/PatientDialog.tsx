import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, Typography, Box } from '@mui/material';
import Patient from '../types/patientsTypes';

interface PatientDialogProps {
  open: boolean;
  onClose: () => void;
  dialogType: 'details' | 'delete' | null;
  selectedPatient: Patient | null;
  onConfirmDelete: () => void;
}

const PatientDialog: React.FC<PatientDialogProps> = ({ open, onClose, dialogType, selectedPatient, onConfirmDelete }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        {dialogType === 'details' ? 'Detalhes do Paciente' : 'Confirmar Exclusão'}
      </DialogTitle>
      <DialogContent>
        {dialogType === 'details' && selectedPatient ? (
          <Box>
            <Typography variant="body1" gutterBottom>
              <strong>ID:</strong> {selectedPatient.id}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Nome:</strong> {selectedPatient.name}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Data de Nascimento:</strong> {new Date(selectedPatient.birth_date).toLocaleDateString()}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Email:</strong> {selectedPatient.email}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Estado:</strong> {selectedPatient.address.state}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Cidade:</strong> {selectedPatient.address.city}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Bairro:</strong> {selectedPatient.address.district}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Rua:</strong> {selectedPatient.address.street}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Número:</strong> {selectedPatient.address.number}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Complemento:</strong> {selectedPatient.address.complement ?? 'N/A'}
            </Typography>
          </Box>
        ) : (
          <DialogContentText>Tem certeza que quer deletar este paciente?</DialogContentText>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" variant="contained">
          Cancelar
        </Button>
        {dialogType === 'delete' && (
          <Button onClick={onConfirmDelete} color="error" variant="contained">
            Deletar
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default PatientDialog;