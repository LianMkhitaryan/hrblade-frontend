import { TOKEN_EXPIRATION_PERIOD } from '@/js/const/index.js';

const setTokenToLocalStorage = (token) => {
  let tokenExpirationDate = new Date();
  tokenExpirationDate.setDate(
    tokenExpirationDate.getDate() + TOKEN_EXPIRATION_PERIOD
  );

  localStorage.setItem('access_token', token);
  localStorage.setItem(
    'access_token_tokenExpirationDate',
    tokenExpirationDate.getTime()
  );
};

export default setTokenToLocalStorage;
