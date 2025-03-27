import React, { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { List, ListItem, ListItemText, IconButton, TextField, Button, Box } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import { handleEdit, handleSave, handleCancel, handleDelete } from "./crudOperations";

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [editingRecipeId, setEditingRecipeId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editImage, setEditImage] = useState(null);
  const [deleteImage, setDeleteImage] = useState(false);
  const [prevDeleteImage, setPrevDeleteImage] = useState(false);

  //Parte que se encarga del READ
  useEffect(() => {
    const colRef = collection(db, "recipes");
    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      const recipesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRecipes(recipesData);
    });

    return () => unsubscribe();
  }, []);

  return (
    <List>
      {recipes.map((recipe) => (
        <ListItem key={recipe.id} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {editingRecipeId === recipe.id ? (
            //Si se esta editando la imagen, muestra los campos y el boton de guardar o cancelar
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, width: "100%" }}>
              {recipe.imageUrl && !deleteImage && editImage === null && (
                //Si no hay imagen previa, o se quiere borrar la imagen, o se va a añadir una nueva, no se va a mostrar la imagen
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1, width: "25%" }}>
                  <img 
                    src={recipe.imageUrl} 
                    alt={recipe.title} 
                    style={{ width: "100%", maxHeight: "100px", objectFit: "cover", borderRadius: "8px" }}
                  />
                  <Button 
                    variant="contained" 
                    sx={{ width: "100%", backgroundColor: "white", borderColor: "blue", color: "purple" }} 
                    onClick={() => setDeleteImage(true)}
                  >
                    Delete image
                  </Button>
                </Box>
              )}
              {editImage ? (
                // si se esta editando la imagen se muestra el nombre de la imagen y la opcion de cancelar
                <>
                  <Button variant="contained" component="label" fullWidth sx={{ width: "30%", backgroundColor: "white", borderColor: "blue", color: "purple" }}>
                    New image uploaded: {editImage.name}
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={(e) => {
                        setEditImage(e.target.files[0]);
                        setPrevDeleteImage(deleteImage);
                        setDeleteImage(false);
                      }}
                    />
                  </Button>
                  <IconButton onClick={() => {
                    setEditImage(null);
                    setDeleteImage(prevDeleteImage);
                  }}>
                    <DeleteIcon />
                  </IconButton>
                </>
              ) : (
                <Button variant="contained" component="label" fullWidth sx={{ width: "30%", backgroundColor: "white", borderColor: "blue", color: "purple" }}>
                  Upload new image (optional)
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => {
                      setEditImage(e.target.files[0]);
                      setPrevDeleteImage(deleteImage);
                      setDeleteImage(false);
                    }}
                  />
                </Button>
              )}
              <TextField label="Recipe title" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} sx={{ width: "30%" }} />
              <TextField label="Description" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} sx={{ width: "30%" }} />
              <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                <IconButton onClick={() => handleSave(recipe.id, recipe.imageUrl, editTitle, editDescription, editImage, deleteImage, setEditingRecipeId, setDeleteImage)}>
                  <SaveIcon />
                </IconButton>
                <IconButton onClick={() => handleCancel(setEditingRecipeId)}>
                  <CancelIcon />
                </IconButton>
              </Box>
            </Box>
          ) : (
            //A menos que se este editando un elemento, se muestra solo su titulo, su descripcion y su imagen
            <Box sx={{ display: "flex", alignItems: "center", width: "100%", gap: 2 }}>
              {recipe.imageUrl && (
                <img 
                  src={recipe.imageUrl} 
                  alt={recipe.title} 
                  style={{ width: "20%", maxHeight: "150px", objectFit: "cover", borderRadius: "8px" }}
                />
              )}
              <ListItemText primary={recipe.title} secondary={`Description: ${recipe.description}`} sx={{ mt: 1 }} />
              <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                <IconButton onClick={() => handleEdit(recipe, setEditingRecipeId, setEditTitle, setEditDescription, setEditImage, setDeleteImage)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(recipe.id, recipe.imageUrl)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
          )}
        </ListItem>
      ))}
    </List>
  );
};

export default RecipeList;
