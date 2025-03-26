// App.js
import React from "react";
import ProductsList from "./components/ProductsList";
import AddProduct from "./components/AddProduct";
import { Container, Typography } from "@mui/material";

function App() {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Firestore Demo: Products List
      </Typography>
      <AddProduct />
      <ProductsList />
    </Container>
  );
}

export default App;
