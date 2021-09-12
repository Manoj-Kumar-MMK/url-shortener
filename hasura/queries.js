const checkUrl = `
query checkUrl($long: String!) {
  URL(where: {long: {_eq: $long}}) {
    short
  }
}
`

const addUrl = `
mutation addUrl($long: String!, $short: String!) {
  insert_URL_one(object: {long: $long, short: $short}) {
    short
  }
}
`
const getUrl = `
query getUrl($short: String!) {
  URL(where: {short: {_eq: $short}}) {
    long
  }
}
`

module.exports = { checkUrl, getUrl, addUrl }
