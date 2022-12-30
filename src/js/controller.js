import * as modal from './model.js';
import recipeView from './views/recipeView.js';
import SearchView from './views/SearchView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { async } from 'regenerator-runtime';
import paginationView from './views/paginationView.js';
import { MODAL_CLOSE_SEC } from './config.js';

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////
//fetch(
//  'https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bc886'
//);
//if (module.hot) {
//  module.hot.accept();
//}
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();
    //0-update results view into mark selected result
    resultsView.update(modal.getSearchResultPage());
    //update bookmarks
    bookmarksView.render(modal.state.bookmarks);
    //1-loading recipe
    await modal.loadRecipe(id);
    //rendering the recipe
    recipeView.render(modal.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

//window.addEventListener('hashchange', controlRecipes);
const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    //1-Get search query
    const query = SearchView.getQuery();
    if (!query) return;
    //2-load search query
    await modal.loadSearchResult(query);
    //3-render results
    console.log(modal.state.search.results);
    // resultsView.render(modal.state.search.results);
    resultsView.render(modal.getSearchResultPage());
    //4-render initial pagination buttons
    paginationView.render(modal.state.search);
  } catch (err) {
    console.log(err);
  }
};
const controlPag = function (goToPage) {
  //1-render new results
  // resultsView.render(modal.state.search.results);
  resultsView.render(modal.getSearchResultPage(goToPage));
  //4-render new pagination buttons
  paginationView.render(modal.state.search);
};
const controlServings = function (newServings) {
  //update the recipe in the state
  modal.updateServings(newServings);
  //update the recipe view
  recipeView.update(modal.state.recipe);
};
const controlAddBookmark = function () {
  //add/delete bookmark
  if (!modal.state.recipe.bookmarked) modal.addBookmark(modal.state.recipe);
  else modal.deleteBookmark(modal.state.recipe.id);
  //update recipe
  recipeView.update(modal.state.recipe);
  //render bookmarkview
  bookmarksView.render(modal.state.bookmarks);
};
const controlBookmarks = function () {
  bookmarksView.render(modal.state.bookmarks);
};
const controlAddRecipe = async function (newRecipe) {
  try {
    //render spinner
    addRecipeView.renderSpinner();
    //upload the new recipe data
    await modal.uploadRecipe(newRecipe);
    console.log(modal.state.recipe);
    //render recipe
    recipeView.render(modal.state.recipe);
    //success message
    addRecipeView.renderMessage();
    //render bookmark view
    bookmarksView.render(modal.state.bookmarks);
    //change id in the url
    window.history.pushState(null, '', `#${modal.state.recipe.id}`);
    //close recipe window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    //console.error(err);
    addRecipeView.renderError(err.message);
  }
};
const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  SearchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPag);
  bookmarksView.addHandlerRender(controlBookmarks);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
