'use strict'

const neo4j = require('neo4j-driver')

const databaseEndpoint = process.env.DB_ENDPOINT
const databaseUsername = process.env.DB_USER
const databasePassword = process.env.DB_PASS

const driver = neo4j.driver(
  databaseEndpoint,
  neo4j.auth.basic(databaseUsername, databasePassword)
)

module.exports.hello = async (event) => {
  const eventBody = JSON.parse(event['body'])
  const networkId = eventBody['networkId']
  const linkId = eventBody['linkId']

  const session = driver.session()
  session
    .run(
      'MERGE ({networkId: $networkId)-[:SHARED_WITH]->({networkId: $linkId)',
      { networkId: networkId, linkId: linkId }
    )
    .then((result) => {
      console.log(result)
      session.close()
      return successResponse()
    })
    .catch((err) => {
      console.log(err)
      session.close()
      return invalidRequest()
    })
}

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
}

const successResponse = () => {
  return {
    statusCode: 200,
    headers: headers,
    body: JSON.stringify(
      {
        message: 'Successfully added',
      },
      null,
      2
    ),
  }
}

const invalidRequest = () => {
  return {
    statusCode: 422,
    headers: headers,
    body: JSON.stringify(
      {
        message: 'Invalid Request',
      },
      null,
      2
    ),
  }
}
