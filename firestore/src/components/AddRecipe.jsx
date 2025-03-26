// components/Addrecipe.js
import React, { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db, storage } from "../firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { TextField, Button, Box } from "@mui/material";

const AddRecipe = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);

  const handleAddrecipe = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = "";
      
      if (image) {
        const imageRef = ref(storage, `recipes/${image.name}`);
        await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef);
      }

      await addDoc(collection(db, "recipes"), { 
        name, 
        price: parseFloat(price), 
        imageUrl
      });

      setName("");
      setPrice("");
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
        label="recipe Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <TextField
        label="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
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
