const isTokenExpired = () => {
  const now = new Date();

  if (
    now.getTime() - localStorage.getItem('access_token_tokenExpirationDate') >
    0
  ) {
    return true;
  } else {
    return false;
  }
};

export default isTokenExpired;
