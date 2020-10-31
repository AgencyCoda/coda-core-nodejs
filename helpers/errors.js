class Errors {
    static get PARAM_REQUIRED() { return this.create(801, 'The param is required.') };
  
    static create(code, message) {
        return { success: false, error: { code: code, message: message } };
    }

    /*static create(errorData, throwError = true) {
      const [code, msg] = errorData;
      const err = Object.assign(new Error(msg), { code, isKnownError: true });
      if (throwError) {
        throw err;
      }
      return err;
    }*/
  }
  
  module.exports = { Errors };