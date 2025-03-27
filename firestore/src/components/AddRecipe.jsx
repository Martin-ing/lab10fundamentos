import React, { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db, storage } from "../firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { TextField, Button, Box, IconButton, } from "@mui/material";
import CancelIcon from "@mui/icons-material/Close";

const AddRecipe = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  //Parte que se encarga del CREATE
  const handleAddrecipe = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = "";      
      // Si hay una imagen, la sube con un nombre único
      if (image) {
        const ImageName = `${Date.now()}-${image.name}`;
        const imageRef = ref(storage, `recipes/${ImageName}`);
        await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef);
      }
  
      // Agrega la receta a Firestore con la URL correcta
      await addDoc(collection(db, "recipes"), { 
        title, 
        description, 
        imageUrl
      });
  
      setTitle("");
      setDescription("");
      setImage(null);
    } catch (err) {
      console.error("Error adding recipe: ", err);
    }
  };

  const handleCancel = () =>{
    setImage(null);
  };
  

  return (
    <Box
    component="form"
    onSubmit={(e) => handleAddrecipe(e, title, description, image)}
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      gap: 2,
    }}
    >
      <TextField
        label="Recipe Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        fullWidth
      />

      <TextField
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        multiline
        rows={3}
        fullWidth
      />
      {image ?(
        //Si se agrego una imagen, muestra el nombre de la imagen y la opcion de cancelar
        <>
        <Box sx={{ display: "flex" }}>
        <Button variant="contained" component="label" fullWidth sx={{backgroundColor: "white", borderColor: "blue", color: "purple" }}>
        Image uploaded: {image.name}
        <input
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => setImage(e.target.files[0])}
        />
        </Button>
        <IconButton onClick={handleCancel}>
          <CancelIcon />
        </IconButton>
        </Box>
        </>
      ):(<Button variant="contained" component="label" fullWidth sx={{backgroundColor: "white", borderColor: "blue", color: "purple" }}>
        Upload Image (optional)
        <input
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => setImage(e.target.files[0])}
        />
        
      </Button>)}
      

      <Button type="submit" variant="contained" fullWidth sx={{ backgroundColor: "purple"}} >
        Add Recipe
      </Button>
  </Box>
  );
};

export default AddRecipe;
