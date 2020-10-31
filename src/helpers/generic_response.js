class CodaResponse {
    static success(result) {
        return { success: true, response: result };
    }

    static fail(result) {
        return { success: false, response: result };
    }
}

module.exports = { CodaResponse };