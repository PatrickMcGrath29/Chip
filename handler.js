'use strict'

import axios from 'axios'
import axiosRetry from 'axios-retry'

axiosRetry(axios, { retries: 3 })
axiosRetry(axios, { retryDelay: axiosRetry.exponentialDelay })

const databaseEndpoint = process.env.DB_ENDPOINT
const databaseUsername = process.env.DB_USER
const databasePassword = process.env.DB_PASS

module.exports.insertRecord = async (event) => {
  const eventBody = JSON.parse(event['body'])
  const networkId = eventBody['networkId']
  const linkId = eventBody['linkId']
  const webpage = eventBody['webpage']

  const body = {
    query:
      'MERGE (a:User {networkId: {networkId}}) MERGE(b:User {networkId: {linkId}}) MERGE ((a)-[:SHARED_WITH { webpage: {webpage}}]->(b))',
    params: {
      networkId: networkId,
      linkId: linkId,
      webpage: webpage,
    },
  }

  let response = await axios
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

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
}
const formatResponse = (response) => {
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
