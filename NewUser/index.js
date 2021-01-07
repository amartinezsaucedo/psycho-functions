var scrumService = require("../service/scrumService");

module.exports = async function (context, req) {
    let response;
    try {
        const documentId = await scrumService.createUser(req);
        response = { body: documentId, status: 200 };
    } catch (error) {
        response = { body: error.message, status: 500 };
    }
    context.res = response;
}