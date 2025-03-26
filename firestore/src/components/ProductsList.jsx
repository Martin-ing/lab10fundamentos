// components/ProductsList.js
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

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");

  useEffect(() => {
    const colRef = collection(db, "products");
    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      const productsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productsData);
    });

    return () => unsubscribe();
  }, []);

  const handleEdit = (product) => {
    setEditingProductId(product.id);
    setEditName(product.name);
    setEditPrice(product.price);
  };

  const handleSave = async (productId) => {
    try {
      const productRef = doc(db, "products", productId);
      await updateDoc(productRef, { name: editName, price: editPrice });
      setEditingProductId(null);
    } catch (err) {
      console.error("Error updating product:", err);
    }
  };

  const handleCancel = () => {
    setEditingProductId(null);
  };

  const handleDelete = async (productId) => {
    try {
      await deleteDoc(doc(db, "products", productId));
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  return (
    <List>
      {products.map((product) => (
        <ListItem key={product.id}>
          {editingProductId === product.id ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                width: "100%",
                gap: 1,
              }}
            >
              <TextField
                label="Product Name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
              <TextField
                label="Price"
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
              />
              <IconButton onClick={() => handleSave(product.id)}>
                <SaveIcon />
              </IconButton>
              <IconButton onClick={handleCancel}>
                <CancelIcon />
              </IconButton>
            </Box>
          ) : (
            <>
              <ListItemText
                primary={product.name}
                secondary={`Price: ${product.price}`}
              />
              <IconButton onClick={() => handleEdit(product)}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => handleDelete(product.id)}>
                <DeleteIcon />
              </IconButton>
            </>
          )}
        </ListItem>
      ))}
    </List>
  );
};

export default ProductsList;
