import crypto from "crypto";

export const generateRoomKey = () => {
  return crypto.randomBytes(32);
};

export const encryptMessage = (message, key) => {
  try {
    // Ensure message is a string
    const messageStr = String(message);
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

    let encrypted = cipher.update(messageStr, "utf8", "hex");
    encrypted += cipher.final("hex");
    const authTag = cipher.getAuthTag();

    return {
      iv: iv.toString("hex"),
      encryptedMessage: encrypted,
      authTag: authTag.toString("hex"),
    };
  } catch (error) {
    console.error("Encryption error:", error);
    throw error;
  }
};

export const decryptMessage = (encryptedData, key) => {
  try {
    const decipher = crypto.createDecipheriv(
      "aes-256-gcm",
      key,
      Buffer.from(encryptedData.iv, "hex")
    );

    decipher.setAuthTag(Buffer.from(encryptedData.authTag, "hex"));

    let decrypted = decipher.update(
      encryptedData.encryptedMessage,
      "hex",
      "utf8"
    );
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    console.error("Decryption error:", error);
    throw error;
  }
};
