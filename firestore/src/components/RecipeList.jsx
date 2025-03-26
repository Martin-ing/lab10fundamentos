// components/recipesList.js
import React, { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  TextField,
  Button,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";

const RecipeList = () => {
  const [recipes, setrecipes] = useState([]);
  const [editingrecipeId, setEditingrecipeId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");

  useEffect(() => {
    const colRef = collection(db, "recipes");
    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      const recipesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setrecipes(recipesData);
    });

    return () => unsubscribe();
  }, []);

  const handleEdit = (recipe) => {
    setEditingrecipeId(recipe.id);
    setEditName(recipe.name);
    setEditPrice(recipe.price);
  };

  const handleSave = async (recipeId) => {
    try {
      const recipeRef = doc(db, "recipes", recipeId);
      await updateDoc(recipeRef, { name: editName, price: editPrice });
      setEditingrecipeId(null);
    } catch (err) {
      console.error("Error updating recipe:", err);
    }
  };

  const handleCancel = () => {
    setEditingrecipeId(null);
  };

  const handleDelete = async (recipeId) => {
    try {
      await deleteDoc(doc(db, "recipes", recipeId));
    } catch (err) {
      console.error("Error deleting recipe:", err);
    }
  };

  return (
    <List>
      {recipes.map((recipe) => (
        <ListItem key={recipe.id}>
          {editingrecipeId === recipe.id ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                gap: 1,
              }}
            >
              <TextField
                label="recipe Name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
              <TextField
                label="Price"
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
              />
              <IconButton onClick={() => handleSave(recipe.id)}>
                <SaveIcon />
              </IconButton>
              <IconButton onClick={handleCancel}>
                <CancelIcon />
              </IconButton>
            </Box>
          ) : (
            <>
              <ListItemText
                primary={recipe.name}
                secondary={`Price: ${recipe.price}`}
              />
              <IconButton onClick={() => handleEdit(recipe)}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => handleDelete(recipe.id)}>
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
