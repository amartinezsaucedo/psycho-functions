var scrumService = require("../service/scrumService");

module.exports = async function (context, req) {
    let response;
    try {
        const result = await scrumService.createMetric(req);
        response = { ...(result && { body: "ok" }), status: result ? 200 : 404 };
    } catch (error) {
        response = { body: error.message, status: 500 };
    }
    context.res = response;
}