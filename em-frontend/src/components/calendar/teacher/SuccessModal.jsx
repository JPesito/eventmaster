import React, { useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle"; // Ícono de éxito
import { useNavigate } from "react-router-dom";

const SuccessModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      // Redirigir automáticamente después de 5 segundos
      const timer = setTimeout(() => {
        navigate("/register");
      }, 5000); // 5000 ms = 5 segundos

      // Limpiar el timer si el componente se desmonta
      return () => clearTimeout(timer);
    }
  }, [isOpen, navigate]);

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <CheckCircleIcon sx={{ color: "green", fontSize: 40, mr: 2 }} /> {/* Ícono de éxito */}
          <Typography variant="h6">¡Registro guardado con éxito!</Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          El evento ha sido guardado correctamente. Serás redirigido automáticamente en 5 segundos.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => navigate("/register")} color="primary" variant="contained">
          Continuar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SuccessModal;