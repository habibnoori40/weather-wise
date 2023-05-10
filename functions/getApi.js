exports.handler = function (event, context, callback) {
    const apiKey = process.env.API_KEY;
    callback(null, {
        statusCode: 200,
        body: apiKey
    });
};