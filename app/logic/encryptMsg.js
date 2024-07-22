export const encryptMessage = (key, str) => {
  const s = [];
  let j = 0,
    res = "";

  // Key Scheduling Algorithm (KSA)
  for (let i = 0; i < 256; i++) {
    s[i] = i;
  }

  for (let i = 0; i < 256; i++) {
    j = (j + s[i] + key.charCodeAt(i % key.length)) % 256;
    [s[i], s[j]] = [s[j], s[i]]; // Swap
  }

  // Pseudo-Random Generation Algorithm (PRGA)
  let i = 0;
  j = 0;
  for (let y = 0; y < str.length; y++) {
    i = (i + 1) % 256;
    j = (j + s[i]) % 256;
    [s[i], s[j]] = [s[j], s[i]]; // Swap

    // RC4+ modification: additional swap and XOR operation
    let t = (s[i] + s[j]) % 256;
    [s[i], s[t]] = [s[t], s[i]]; // Additional swap

    // Double XOR
    let k = s[(s[i] + s[j]) % 256] ^ s[(s[t] + s[i]) % 256];
    res += String.fromCharCode(str.charCodeAt(y) ^ k);
  }

  console.log({encryptedText: res});

  return res;
};
