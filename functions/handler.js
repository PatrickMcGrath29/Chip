'use strict'

const AWS = require('aws-sdk')
const uuid = require('uuid')

AWS.config.setPromisesDependency(require('bluebird'))

const dynamoDb = new AWS.DynamoDB.DocumentClient()

module.exports.addLink = async (event) => {
  // Required Fields
  const eventBody = JSON.parse(event['body'])
  const networkId = eventBody['networkId']
  const linkId = eventBody['linkId']
  const webpage = eventBody['webpage']
  // Optional Fields
  const ipAddress = event['requestContext']['identity']['sourceIp']

  if (!(networkId && linkId && webpage)) {
    return formatResponse({ code: 400, status: 'INVALID INPUT' })
  }

  const response = await insertRecord(
    createRecord(networkId, linkId, webpage, ipAddress)
  )

  return formatResponse(response)
}

const createRecord = (networkId, linkId, webpage, ipAddress) => {
  const timestamp = new Date().getTime()
  return {
    id: uuid.v1(),
    networkId: networkId,
    linkId: linkId,
    webpage: webpage,
    ipAddress: ipAddress,
  }
}

const insertRecord = async (record) => {
  const entry = {
    TableName: process.env.RECORD_TABLE,
    Item: record,
  }
  return dynamoDb
    .put(entry)
    .promise()
    .then(() => {
      return { code: 200, status: 'OK' }
    })
    .catch(() => {
      return { code: 500, status: 'ERROR SAVING DATA' }
    })
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
