import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  IconButton,
} from "@mui/material";
import {
  Person as PersonIcon,
  School as SchoolIcon,
  Book as BookIcon,
  Build as BuildIcon,
  Room as RoomIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

const elements = [
  { name: "Profesores", icon: PersonIcon },
  { name: "Programas Académicos", icon: SchoolIcon },
  { name: "Asignaturas", icon: BookIcon },
  { name: "Herramientas", icon: BuildIcon },
  { name: "Salones", icon: RoomIcon },
];

function ElementCard({ name, icon: Icon, onClick }) {
  return (
    <Card
      sx={{ cursor: "pointer", "&:hover": { bgcolor: "action.hover" } }}
      onClick={onClick}
    >
      <CardContent>
        <Typography variant="h6" component="div">
          {name}
        </Typography>
        <Icon color="action" />
        <Typography variant="body2" color="text.secondary">
          Gestionar {name.toLowerCase()}
        </Typography>
      </CardContent>
    </Card>
  );
}

function CRUDInterface({ element }) {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [editingId, setEditingId] = useState(null);

  const addItem = () => {
    if (newItem.trim()) {
      setItems([...items, { id: Date.now(), name: newItem }]);
      setNewItem("");
    }
  };

  const updateItem = (id, newName) => {
    setItems(items.map((item) => (item.id === id ? { ...item, name: newName } : item)));
    setEditingId(null);
  };

  const deleteItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        {element}
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs>
          <TextField
            fullWidth
            placeholder={`Nuevo ${element.slice(0, -1).toLowerCase()}`}
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
          />
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={addItem}>
            Agregar
          </Button>
        </Grid>
      </Grid>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  {editingId === item.id ? (
                    <TextField
                      value={item.name}
                      onChange={(e) => updateItem(item.id, e.target.value)}
                      onBlur={() => setEditingId(null)}
                      autoFocus
                    />
                  ) : (
                    item.name
                  )}
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => setEditingId(item.id)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => deleteItem(item.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default function HomeAdmin() {
  const [selectedElement, setSelectedElement] = useState(null);

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: 16 }}>
      <Typography variant="h3" gutterBottom>
        Dashboard CRUD
      </Typography>
      {selectedElement ? (
        <>
          <Button
            variant="contained"
            onClick={() => setSelectedElement(null)}
            sx={{ mb: 2 }}
          >
            Volver al Dashboard
          </Button>
          <CRUDInterface element={selectedElement} />
        </>
      ) : (
        <Grid container spacing={2}>
          {elements.map((element) => (
            <Grid item xs={12} sm={6} md={4} key={element.name}>
              <ElementCard
                name={element.name}
                icon={element.icon}
                onClick={() => setSelectedElement(element.name)}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
}