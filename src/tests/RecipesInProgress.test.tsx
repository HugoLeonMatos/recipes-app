import { screen, waitForElementToBeRemoved } from '@testing-library/react';

import renderWithRouter from '../helpers/renderWithRouter';
import RecipeInProgress from '../page/RecipeInProgress';
import App from '../App';

// Objeto do Mock
// const mockRecipeResponse = {
//   id: '52818',
//   nationality: 'American',
//   title: 'Chicken Fajita Mac and Cheese',
//   category: 'Chicken',
//   image: 'https://www.themealdb.com/images/media/meals/qrqywr1503066605.jpg',
//   ingredients: [
//     { strIngredient1: 'macaroni', measure: '500g' },
//     { strIngredient2: 'chicken stock', measure: '2 cups' },
//     { strIngredient3: 'heavy cream', measure: '1/2 cup' },
//     { strIngredient4: 'fajita seasoning', measure: '1 packet' },
//     { strIngredient5: 'salt', measure: '1 tsp' },
//     { strIngredient6: 'chicken breast', measure: '3 diced' },
//     { strIngredient7: 'olive oil', measure: '2 tbsp' },
//     { strIngredient8: 'onion', measure: '1 small finely diced' },
//     { strIngredient9: 'red pepper', measure: '2 finely diced' },
//     { strIngredient10: 'garlic', measure: '2 cloves minced' },
//     { strIngredient11: 'cheddar cheese', measure: '1 cup' },
//     { strIngredient12: 'parsley', measure: 'garnish chopped' },
//   ],
//   isAlcoholicOrNot: '',
//   tags: ['Pasta', 'Cheasy', 'Meat'],
// };

// before / each
test('Renderiza o componente corretamente', () => {
  // Renderiza o componente
  renderWithRouter(<App />, { route: '/' });

  expect(<RecipeInProgress />);
});

test('Testa fetch', async () => {
  // const fetchResolvedValue = {
  //   json: async () => mockRecipeResponse,
  // } as Response;

  // vi.spyOn(global, 'fetch')
  //   .mockResolvedValue(fetchResolvedValue);

  renderWithRouter(<App />, { route: '/meals/52818/in-progress' });

  await waitForElementToBeRemoved(() => screen.getByText(/Loading.../i));
  const recipeTitle = screen.getByText('Chicken Fajita Mac and Cheese');
  expect(recipeTitle).toBeInTheDocument();
});
