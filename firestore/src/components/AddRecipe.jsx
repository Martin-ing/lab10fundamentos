import React, { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db, storage } from "../firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { TextField, Button, Box } from "@mui/material";

const AddRecipe = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  //Parte que se encarga del CREATE
  const handleAddrecipe = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = "";
      //Si hay una imagen, se añade al storage y se guarda el link
      if (image) {
        const imageRef = ref(storage, `recipes/${image.title}`);
        await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef);
      }

      //Se agrega la informacion a la base de datos
      await addDoc(collection(db, "recipes"), { 
        title, 
        description: description, 
        imageUrl
      });

      setTitle("");
      setDescription("");
      setImage(null);
    } catch (err) {
      console.error("Error adding recipe: ", err);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleAddrecipe}
      sx={{ display: "flex", gap: 2, mb: 2 }}
    >
      <TextField
        label="recipe title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <TextField
        label="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
      />
      <Button type="submit" variant="contained" color="primary">
        Add recipe
      </Button>
    </Box>
  );
};

export default AddRecipe;
