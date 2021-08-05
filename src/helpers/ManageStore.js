import UseCrypto from "../hooks/useCrypto";

export const setKeyInStorage = (label = null, value = '') => {
  try {

    if (!label) throw new Error('Label not defined');

    const labelEncrypt = UseCrypto(label, 'en');
    const dataEncrypt = UseCrypto(value, 'en');
    sessionStorage.setItem(labelEncrypt, dataEncrypt.toString());

    return true;

  } catch (error) {

    console.log(error);

    return false;
  }
}

export const getKeyInStorage = (label = null) => {
  try {

    if (!label) throw new Error('Label not defined');

    const labelEncrypt = UseCrypto(label, 'en');
    const dataStorage = sessionStorage.getItem(labelEncrypt);
    const dataDecrypt = dataStorage ? UseCrypto(dataStorage, 'de') : false;

    return dataDecrypt;

  } catch (error) {
    console.log(error);
    return false;
  }
}

export const removeKeyInStorage = (label = null) => {
  try {

    if (!label) throw new Error('Label not defined');

    const labelEncrypt = UseCrypto(label, 'en');
    sessionStorage.removeItem(labelEncrypt);

    return true;

  } catch (error) {
    console.log(error);
    return false;
  }
}

export const clearStorage = () => {
  try {

    sessionStorage.clear();

    return true;

  } catch (error) {
    console.log(error);
    return false;
  }
}
