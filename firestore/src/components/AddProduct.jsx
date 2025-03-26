// components/AddProduct.js
import React, { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { TextField, Button, Box } from "@mui/material";

const AddProduct = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "products"), { name, price });
      setName("");
      setPrice("");
    } catch (err) {
      console.error("Error adding product: ", err);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleAddProduct}
      sx={{ display: "flex", gap: 2, mb: 2 }}
    >
      <TextField
        label="Product Name"
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
      <Button type="submit" variant="contained" color="primary">
        Add Product
      </Button>
    </Box>
  );
};

export default AddProduct;
