import React from 'react';
import { screen, waitForElementToBeRemoved } from '@testing-library/react';
// import { BrowserRouter } from 'react-router-dom';
// import RecipeDetails from '../page/RecipeDetails';
import renderWithRouter from '../helpers/renderWithRouter';
import App from '../App';

const rota = '/meals/53013';
test('renders loading message if recipeDetails is not available', () => {
  renderWithRouter(<App />, { route: rota });

  const loadingMessage = screen.getByText(/Loading.../i);
  expect(loadingMessage).toBeInTheDocument();
});

test('Renderiza o componente RecipeDetails', () => {
  renderWithRouter(<App />, { route: rota });
});

test('Testa fetch detalhes', async () => {
  // const fetchResolvedValue = {
  //   json: async () => mockRecipeResponse,
  // } as Response;

  // vi.spyOn(global, 'fetch')
  //   .mockResolvedValue(fetchResolvedValue);

  renderWithRouter(<App />, { route: rota });

  await waitForElementToBeRemoved(() => screen.getByText(/Loading.../i));
  const nameRecipe = screen.getByText('Big Mac');
  expect(nameRecipe).toBeInTheDocument();
});
