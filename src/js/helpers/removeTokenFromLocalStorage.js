const removeTokenFromLocalStorage = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('access_token_tokenExpirationDate');
};

export default removeTokenFromLocalStorage;
