import bcrypt from "bcrypt";

export function hashPassword(
  password: string,
  saltRounds: number = 12
): Promise<string> {
  const salt = bcrypt.genSaltSync(saltRounds);
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, salt, (err, hash) => {
      if (err) return reject(err);
      resolve(hash);
    });
  });
}

export function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hashedPassword, function (err, result) {
      if (err) return reject(err);
      resolve(result);
    });
  });
}

// export function generateSalt(saltRounds: number = 10): Promise<string> {
//   return new Promise((resolve, reject) => {
//     bcrypt.genSalt(saltRounds, (err, salt) => {
//       if (err) return reject(err);
//       resolve(salt);
//     });
//   });
// }
