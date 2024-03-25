import { initSdk } from "./initSdk";

describe("Crypto", () => {
  it("should encrypt and decrypt data successfully", () => {
    const { crypto } = initSdk();

    const password = "super secure";
    const params = crypto.makeEncryptionParams(password);
    const plainText = "This is sensitive data";
    const cipherText = crypto.encrypt(params, plainText);

    const decryptedData = crypto.decrypt(cipherText, params, password);
    expect(decryptedData).toBe(plainText);
  });
});
