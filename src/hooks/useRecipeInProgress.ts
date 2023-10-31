import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import fetchData from '../services/fetchData';
import {
  saveRecipeProgress,
  getRecipeProgress,
  toggleFavoriteRecipe } from '../services/localStorageUtils';

type RecipeDetailType = {
  image: string;
  title: string;
  category: string;
  nationality: string;
  ingredients: { ingredient: string; measure: string }[];
} | null;

function useRecipeInProgress() {
  const location = useLocation();
  const { id } = useParams();
  const [recipeDetails, setRecipeDetails] = useState<RecipeDetailType>(null);
  const isMeal = location.pathname.includes('/meals/');
  const [checkedIngredients, setCheckedIngredients] = useState<number[]>([]);
  const [messageCopied, setMessageCopied] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (id) {
      const progress = getRecipeProgress(id, isMeal);
      setCheckedIngredients(progress);
    }
  }, [id, isMeal]);

  function extractIngredients(recipe: any) {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      if (recipe[`strIngredient${i}`]) {
        ingredients.push({
          ingredient: recipe[`strIngredient${i}`],
          measure: recipe[`strMeasure${i}`],
        });
      }
    }
    return ingredients;
  }

  const handleCheckboxChange = (index: number) => {
    let updatedIngredients;

    if (checkedIngredients.includes(index)) {
      updatedIngredients = checkedIngredients.filter((item) => item !== index);
    } else {
      updatedIngredients = [...checkedIngredients, index];
    }

    setCheckedIngredients(updatedIngredients);

    if (id) {
      saveRecipeProgress(id, isMeal, updatedIngredients);
    }
  };
  useEffect(() => {
    function isRecipeFavorite() {
      const storedFavorites = localStorage.getItem('favoriteRecipes') || '[]';
      const parseFavorites = JSON.parse(storedFavorites);
      return parseFavorites.some((recipe: any) => recipe.id === id);
    }
    setIsFavorite(isRecipeFavorite());
  }, [id]);

  useEffect(() => {
    function getEndpoint() {
      if (isMeal) return `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
      return `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`;
    }

    async function fetchRecipeDetails() {
      const endpoint = getEndpoint();
      const data = await fetchData(endpoint);
      const recipe = (data.meals && data.meals[0]) || (data.drinks && data.drinks[0]);

      const ingredients = extractIngredients(recipe);

      if (!recipe) return;
      setRecipeDetails({
        image: recipe.strMealThumb || recipe.strDrinkThumb,
        title: recipe.strMeal || recipe.strDrink,
        category: isMeal
          ? recipe.strCategory : `${recipe.strCategory} - ${recipe.strAlcoholic}`,
        ingredients,
        nationality: recipe.strArea || '',
      });
      if (!id) return;
      const progress = getRecipeProgress(id, isMeal);
      setCheckedIngredients(progress);
    }
    fetchRecipeDetails();
  }, [id, location, isMeal]);

  function handleShareClick() {
    let recipeLink = window.location.href;
    recipeLink = recipeLink.replace('/in-progress', '');

    // copiar para o clipboard
    navigator.clipboard.writeText(recipeLink);

    // seta estado
    setMessageCopied(true);
  }

  function handleFavoriteClick() {
    if (recipeDetails && id) {
      toggleFavoriteRecipe(recipeDetails, id, isMeal);
      setIsFavorite(!isFavorite);
    }
  }
  return {
    isMeal,
    recipeDetails,
    checkedIngredients,
    messageCopied,
    isFavorite,
    handleCheckboxChange,
    handleShareClick,
    handleFavoriteClick,
  };
}

export default useRecipeInProgress;
