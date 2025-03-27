import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "../firebaseConfig";

export const handleEdit = (recipe, setEditingRecipeId, setEditTitle, setEditDescription, setEditImage, setDeleteImage) => {
  setDeleteImage(false);
  setEditingRecipeId(recipe.id);
  setEditTitle(recipe.title);
  setEditDescription(recipe.description);
  setEditImage(null);
};

//Parte que se encarga del UPDATE
export const handleSave = async (recipeId, currentImageUrl, editTitle, editDescription, editImage, deleteImage, setEditingRecipeId, setDeleteImage) => {
  try {
    let imageUrl = currentImageUrl;

    // Si se agrega una nueva imagen, la sube
    if (editImage) {
      setDeleteImage(false);
      const imageName = `${Date.now()}-${editImage.name}`;
      const imageRef = ref(storage, `recipes/${imageName}`);
      await uploadBytes(imageRef, editImage);
      imageUrl = await getDownloadURL(imageRef);
      // Si se agrega una nueva imagen, la sube
      if (currentImageUrl) {
        const oldImageRef = ref(storage, currentImageUrl);
        await deleteObject(oldImageRef).catch(() => {});
      }
    }

    // Esto es en caso de que solo se elimine la imagen
    if (deleteImage) {
      if (currentImageUrl) {
        const oldImageRef = ref(storage, currentImageUrl);
        await deleteObject(oldImageRef).catch(() => {});
      }
      imageUrl = "";
      setDeleteImage(false);
    }

    const recipeRef = doc(db, "recipes", recipeId);
    await updateDoc(recipeRef, { title: editTitle, description: editDescription, imageUrl });
    setEditingRecipeId(null);
  } catch (err) {
    console.error("Error updating recipe:", err);
  }
};

export const handleCancel = (setEditingRecipeId) => {
  setEditingRecipeId(null);
};

//Parte que se encarga del DELETE
export const handleDelete = async (recipeId, imageUrl) => {
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
