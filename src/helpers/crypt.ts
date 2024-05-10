import SimpleCrypto from "simple-crypto-js";

const crypt = new SimpleCrypto(
  process.env.ENCRYPT_KEY_1! +
    process.env.ENCRYPT_KEY_2 +
    process.env.ENCRYPT_KEY_3
);

export default crypt;
