export function generateRandomPassword() {
  const numbers = "0123456789";
  const letters = "abcdefghijklmnopqrstuvwxyz";
  const specialChars = "!@#$%^&*?";
  const upperLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  // Generate the required parts of the password
  const randomNumbers = Array.from(
    { length: 3 },
    () => numbers[Math.floor(Math.random() * numbers.length)]
  ).join("");
  const randomLetters = Array.from(
    { length: 4 },
    () => letters[Math.floor(Math.random() * letters.length)]
  ).join("");
  const randomSpecialChar =
    specialChars[Math.floor(Math.random() * specialChars.length)];
  const randomUpperLetter =
    upperLetters[Math.floor(Math.random() * upperLetters.length)];

  // Combine all parts
  const passwordParts = [
    randomNumbers,
    randomLetters,
    randomSpecialChar,
    randomUpperLetter,
  ];

  // Shuffle the parts to ensure randomness in the final password
  const shuffledPassword = passwordParts
    .sort(() => Math.random() - 0.5)
    .join("");

  return shuffledPassword;
}
