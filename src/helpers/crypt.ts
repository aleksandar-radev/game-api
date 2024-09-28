import SimpleCrypto from 'simple-crypto-js';

const crypt = new SimpleCrypto(process.env.ENCRYPT_KEY);

export default crypt;
