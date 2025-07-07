const storeInSession = (key: string, value: string) => {
  return sessionStorage.setItem(key, value);
};

const userInSession = (key: string, value: string) => {
  return sessionStorage.setItem(key, value);
};

const removeFromSession = (key: string) => {
  return sessionStorage.removeItem(key);
};

const logOutUser = () => {
  sessionStorage.clear();
};

const userIdInSession = (key: string, value: string) => {
  return sessionStorage.setItem(key, value);
};

const lookInSession = (key: string): string | null => {
  return sessionStorage.getItem(key);
};

export {
  storeInSession,
  userInSession,
  removeFromSession,
  logOutUser,
  userIdInSession,
  lookInSession,
};
