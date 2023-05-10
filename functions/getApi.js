exports.handler = function (event, context, callback) {
    const apiKey = process.env.API_KEY;
    callback(null, {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "https://habibnoori40.github.io/weather-wise/, https://gregarious-froyo-8a5085.netlify.app/",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ key: apiKey })
    });
};