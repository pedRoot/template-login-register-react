import Crypto from "crypto-js";

const useCrypto = (chain, action = 'en') => {
	const key = Crypto.enc.Hex.parse(process.env.REACT_APP_CYPHER_KEY);
	const iv = Crypto.enc.Hex.parse(process.env.REACT_APP_CYPHER_IV);

	if (action === 'en') {
		return Crypto.AES.encrypt(chain, key, { iv }).toString();
	} else {
		return Crypto.AES.decrypt(chain, key, { iv }).toString(Crypto.enc.Utf8);
	}
}

export default useCrypto;