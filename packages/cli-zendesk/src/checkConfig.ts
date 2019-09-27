import assert from 'assert'

const checkConfig = () => {
  const {
    GOOGLE_MAPS_API_KEY,
    HASURA_API_URL,
    X_HASURA_ADMIN_SECRET,
    ZENDESK_API_TOKEN,
    ZENDESK_API_URL,
    ZENDESK_API_USER,
    COMMUNITY_ID,
  } = process.env
  
  try {
    assert.ok(GOOGLE_MAPS_API_KEY, 'GOOGLE_MAPS_API_KEY not setted')
    assert.ok(HASURA_API_URL, 'HASURA_API_URL not setted')
    assert.ok(X_HASURA_ADMIN_SECRET, 'X_HASURA_ADMIN_SECRET not setted')
    assert.ok(ZENDESK_API_TOKEN, 'ZENDESK_API_TOKEN not setted')
    assert.ok(ZENDESK_API_URL, 'ZENDESK_API_URL not setted')
    assert.ok(ZENDESK_API_USER, 'ZENDESK_API_USER not setted')
    assert.ok(COMMUNITY_ID, 'COMMUNITY_ID not setted')
  } catch (e) {
    throw e
  }
}

export default checkConfig
