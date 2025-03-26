import React, { useState, useEffect } from "react";
import { collection, onSnapshot, updateDoc, doc, deleteDoc, } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "../firebaseConfig";
import { List, ListItem, ListItemText, IconButton, TextField, Button, Box, Avatar, } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [editingRecipeId, setEditingRecipeId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editImage, setEditImage] = useState(null);

  //Parte que se encarga del READ
  useEffect(() => {
    const colRef = collection(db, "recipes");
    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      //Extrae los datos de la base de datos y los guarda en recipesData para despues guardarlo en recipes
      const recipesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRecipes(recipesData);
    });

    return () => unsubscribe();
  }, []);

  const handleEdit = (recipe) => {
    setEditingRecipeId(recipe.id);
    setEditTitle(recipe.title);
    setEditDescription(recipe.description);
    setEditImage(null);
  };

  //Parte que se encarga del UPDATE
  const handleSave = async (recipeId, currentImageUrl) => {
    try {
      let imageUrl = currentImageUrl;

      // Si se agrega una nueva imagen, la sube
      if (editImage) {
        const imageRef = ref(storage, `recipes/${editImage.title}`);
        await uploadBytes(imageRef, editImage);
        imageUrl = await getDownloadURL(imageRef);
        // Elimina la imagen anterior
        if (currentImageUrl) {
          const oldImageRef = ref(storage, currentImageUrl);
          await deleteObject(oldImageRef).catch(() => {});
        }
      }

      const recipeRef = doc(db, "recipes", recipeId);
      await updateDoc(recipeRef, { 
        title: editTitle, 
        description: editDescription, 
        imageUrl 
      });

      setEditingRecipeId(null);
    } catch (err) {
      console.error("Error updating recipe:", err);
    }
  };

  const handleCancel = () => {
    setEditingRecipeId(null);
  };

  //Parte que se encarga del DELETE
  const handleDelete = async (recipeId, imageUrl) => {
    try {
      // Borra la info de la base de datos
      await deleteDoc(doc(db, "recipes", recipeId));

      // Si hay una imagen la borra de Firebase Storage
      if (imageUrl) {
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef).catch(() => {});
      }
    } catch (err) {
      console.error("Error deleting recipe:", err);
    }
  };

  return (
    <List>
      {recipes.map((recipe) => (
        <ListItem key={recipe.id} sx={{ display: "flex", alignItems: "center", gap: 2 }}>

          {editingRecipeId === recipe.id ? (
            //Si se esta editando la imagen, muestra los campos y el boton de guardar o cancelar
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, width: "100%" }}>
              <TextField
                label="Recipe title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
              <TextField
                label="description"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setEditImage(e.target.files[0])}
              />
              <IconButton onClick={() => handleSave(recipe.id, recipe.imageUrl)}>
                <SaveIcon />
              </IconButton>
              <IconButton onClick={handleCancel}>
                <CancelIcon />
              </IconButton>
            </Box>
          ) : (
            //A menos que se este editando un elemento, se muestra solo su titulo, su descripcion y su imagen
            <>
              {recipe.imageUrl && (
                <Avatar src={recipe.imageUrl} alt={recipe.title} sx={{ width: 50, height: 50 }} />
              )}
              <ListItemText
                primary={recipe.title}
                secondary={`description: $${recipe.description}`}
              />
              <IconButton onClick={() => handleEdit(recipe)}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => handleDelete(recipe.id, recipe.imageUrl)}>
                <DeleteIcon />
              </IconButton>
            </>
          )}
        </ListItem>
      ))}
    </List>
  );
};

export default RecipeList;
