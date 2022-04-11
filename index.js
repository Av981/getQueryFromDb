require('dotenv').config();
const AWS = require('aws-sdk');
AWS.config.update ( {
  region: 'ap-south-1'
});
const dynamodb = new AWS.DynamoDB.DocumentClient();
const dynamodbTableName = process.env.DYNAMODB_TABLE;
const productsPath = '/getdata';

exports.handler = async function(event) {
console.log('Request event: ', event);
let response;

  switch(true) {
    case event.httpMethod === 'GET' && event.path === productsPath:
      response = await getProducts(event.queryStringParameters.userid);
      break;
    default:
      response = buildResponse(404, '404 Not Found');
  }
  return response;
}


async function getProducts(userid) {
  const params = {
    TableName: dynamodbTableName,
    key:{
      'userid':userid
      
    }
    
  }
  const allProducts = await scanDynamoRecords(userid, params, []);
  const body = 
allProducts
  
  return buildResponse(200, body);
}

async function scanDynamoRecords(userid, scanParams, itemArray) {
  try {
    const dynamoData = await dynamodb.scan(scanParams).promise();
     var itemarr=[];
    itemarr=itemarr.concat(dynamoData.Items);
   itemArray= itemarr.filter(function(id){
    return id.userid==userid
    })
    if (dynamoData.LastEvaluatedKey) {
      scanParams.ExclusiveStartkey = dynamoData.LastEvaluatedKey;
      return await scanDynamoRecords(scanParams, itemArray);
    }
    return itemArray;
  } catch(error) {
    console.error(error);
  }
}

function buildResponse(statusCode, body) {
  return {
    statusCode: statusCode,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }
}

