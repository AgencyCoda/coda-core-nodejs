const crypto = require('crypto');

class Password {
  /** @private */
  static get HASH_ITERATIONS () { return 100; }

  /** @private */
  static get HASH_LENGTH () { return 60; }

  /** @private */
  static get HASH_ALG () { return 'sha512'; }

  /**
   * @param {string} password
   * @returns {Promise<string>}
   */
  static async hash(password) {
    if (!password) {
      throw new Error('Password cannot be empty');
    }
    return new Promise((resolve, reject) => {
      const salt = crypto.randomBytes(10).toString('base64');

      crypto.pbkdf2(password, salt, this.HASH_ITERATIONS, this.HASH_LENGTH, this.HASH_ALG, (err, key) => {
        if (err) {
          reject(err);
          return;
        }
        // function:algorithm:iterations:salt:key(hex)
        resolve(`PBKDF2:${this.HASH_ALG}:${this.HASH_ITERATIONS}:${salt}:${key.toString('hex')}`);
      });
    });
  }

  /**
   * @param {string} password
   * @returns {Promise<string>}
   */
  static async hash20(salt) {
    const unique = process.hrtime() + '_' + salt;
    return new Promise((resolve, reject) => {
      const salt = crypto.randomBytes(10).toString('base64');

      crypto.pbkdf2(unique, salt, this.HASH_ITERATIONS, 20, this.HASH_ALG, (err, key) => {
        if (err) {
          reject(err);
          return;
        }
        // function:algorithm:iterations:salt:key(hex)
        resolve(`${key.toString('hex')}`);
      });
    });
  }

  /**
   * @param {string} password
   * @param {string} hashedPassword
   * @returns {Promise<boolean>}
   */
  static async compare(password, hashedPassword) {
    return new Promise((resolve, reject) => {
      // PBKDF2:sha512:[i]:salt:password
      const [_f, alg, iterations, salt, hash] = hashedPassword.split(':');

      crypto.pbkdf2(password, salt, parseInt(iterations, 10), this.HASH_LENGTH, alg, (err, key) => {
        if (err) {
          reject(err);
          return;
        }
        if (hash !== key.toString('hex')) {
          resolve(false);
          return;
        }
        resolve(true);
      });
    });
  }
}

module.exports = {
  Password,
};
