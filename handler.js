'use strict'

const neo4j = require('neo4j-driver').v1

const databaseEndpoint = process.env.DB_ENDPOINT
const databaseUsername = process.env.DB_USER
const databasePassword = process.env.DB_PASS

const driver = neo4j.driver(
  databaseEndpoint,
  neo4j.auth.basic(databaseUsername, databasePassword)
)

module.exports.hello = async (event) => {
  const session = driver.session()

  const networkId = event['networkId']
  const linkId = event['linkId']

  session
    .run(
      `MERGE ({networkId: ${networkId}})-[:SHARED_WITH]->({networkId: ${linkId}})`
    )
    .then((result) => {
      session.close()
      return successResponse()
    })
    .catch((err) => {
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
