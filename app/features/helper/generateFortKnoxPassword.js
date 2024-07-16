export default function generateFortKnoxPassword() {
  // Define the characters to be used in the password
  const upperCaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowerCaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const numericChars = '0123456789';
  const specialChars = '!@#$%^&*()_+[]{}|;:,.<>?';
  
  // Combine all characters
  const allChars = upperCaseChars + lowerCaseChars + numericChars + specialChars;
  
  // Ensure the password has at least one of each type of character
  const getRandomChar = (chars) => chars[Math.floor(Math.random() * chars.length)];
  
  let password = '';
  password += getRandomChar(upperCaseChars);
  password += getRandomChar(lowerCaseChars);
  password += getRandomChar(numericChars);
  password += getRandomChar(specialChars);
  
  // Generate the rest of the password
  for (let i = password.length; i < 30; i++) {
    password += getRandomChar(allChars);
  }
  
  // Shuffle the password to avoid predictable patterns
  const shufflePassword = (password) => {
    const arr = password.split('');
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join('');
  };
  
  return shufflePassword(password);
}

