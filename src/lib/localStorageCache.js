const LOCAL_STORAGE_KEY = 'CARBON_COPY_NAME';
const LOCAL_STORAGE_OPPONENT_KEY = 'CARBON_COPY_OPPONENT_NAME';

export const getLocalStorage = () => {
  if (!window.localStorage) {
    console.log('No localStorage support. Private window?');
    return {};
  }

  const cachedName = window.localStorage.getItem(LOCAL_STORAGE_KEY);

  if (!cachedName) {
    console.log('No name cached in localStorage');
    return {};
  }

  const cachedOpponentName = window.localStorage.getItem(LOCAL_STORAGE_OPPONENT_KEY);

  const localStorageCache = {
    name: cachedName || null,
    opponentName: cachedOpponentName || null,
  };

  console.log('Got localStorageCache:', localStorageCache);

  return localStorageCache;
};

const setLocalStorage = (key, name) => {
  if (!window.localStorage || !name) {
    return;
  }

  console.log('Caching', key === LOCAL_STORAGE_KEY ? 'player' : 'opponent', 'name:', name);

  window.localStorage.setItem(key, name);
}

export const setLocalStorageName = (name) => {
  setLocalStorage(LOCAL_STORAGE_KEY, name);
}

export const setLocalStorageOpponentName = (name) => {
  setLocalStorage(LOCAL_STORAGE_OPPONENT_KEY, name);
}
