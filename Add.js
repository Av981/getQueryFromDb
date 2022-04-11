const AWS = require("aws-sdk");
AWS.config.update({
  region: "ap-south-1",
});
const Path = "/add";

exports.handler = async function (event) {
  let response;

  if (event.httpMethod === "GET" && event.path === Path) {
    response = await saveAdd(JSON.parse(event.body));
  } else {
    response = buildResponse(404, "404 Not Found");
  }
  return response;
};

async function saveAdd(requestBody) {
  const result = requestBody.a + requestBody.b;
  const body = {
    Operation: "ADDITION",
    Message: " ADDED SUCCESSFULLY",
    Item: result,
  };
  return buildResponse(200, body);
}

function buildResponse(statusCode, body) {
  return {
    statusCode: statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify(body),
  };
}
