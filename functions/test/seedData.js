const axios = require('axios')

const upperLimitCount = 1000
const totalUserCount = 200
// Range for number of friends a user has
const minFriendCount = 10
const maxFriendCount = 50
// Range for liklihood of sharing content
const minShareRate = 0
const maxShareRate = 0.2
// Range for liklihood of clicking on content
const minClickRate = 0
const maxClickRate = 0.5

const seedTable = () => {
  const userNetworkIds = getUserNetworkIds()

  userNetworkIds.forEach((networkId) => {
    if (Math.random() < averageShareRate) {
    }
  })
}

const getUserNetworkIds = () => {
  let networkIds = {}

  let i = 0
  for (; i < totalUserCount; i++) {
    networkIds[generateNetworkId()] = {
      friendCount: getRandomInteger(minFriendCount, maxFriendCount),
      shareRate: Math.random() * (maxShareRate - minShareRate) + minShareRate,
    }
  }

  return networkIds
}

const getRandomInteger = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const generateNetworkId = () => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  )
}
