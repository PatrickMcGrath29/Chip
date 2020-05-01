'use strict'

const axios = require('axios')
const axiosRetry = require('axios-retry')

axiosRetry(axios, { retries: 5 })
axiosRetry(axios, { retryDelay: axiosRetry.exponentialDelay })

const databaseEndpoint = process.env.DB_ENDPOINT
const databaseUsername = process.env.DB_USER
const databasePassword = process.env.DB_PASS

module.exports.addLink = async (event) => {
  // Required Fields
  const eventBody = JSON.parse(event['body'])
  const networkId = eventBody['networkId']
  const linkId = eventBody['linkId']
  const webpage = eventBody['webpage']
  // Optional Fields
  const ipAddress = event['requestContext']['identity']['sourceIp']

  const body = {
    query:
      'MERGE (a:User {networkId: {networkId}}) MERGE(b:User {networkId: {linkId}}) MERGE ((a)-[:SHARED_WITH { webpage: {webpage}}]->(b))',
    params: {
      networkId: networkId,
      linkId: linkId,
      webpage: webpage,
    },
  }

  const response = await axios
    .post(databaseEndpoint, body, {
      auth: {
        username: databaseUsername,
        password: databasePassword,
      },
    })
    .then((res) => {
      return { code: 200, status: 'OK' }
    })
    .catch((err) => {
      console.log(err)
      return { code: 400, status: 'ERROR' }
    })

  return formatResponse(response)
}

const formatResponse = (response) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  }

  return {
    statusCode: response.code,
    headers: headers,
    body: JSON.stringify(
      {
        status: response.status,
      },
      null,
      2
    ),
  }
}
