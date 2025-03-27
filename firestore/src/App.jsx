import React from "react";
import RecipeList from "./components/RecipeList";
import AddRecipe from "./components/AddRecipe";
import { Container, Typography } from "@mui/material";

function App() {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Recipes List
      </Typography>
      <AddRecipe />
      <RecipeList />
    </Container>
  );
}

export default App;
