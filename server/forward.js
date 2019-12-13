import zendesk from 'node-zendesk'
const { ZENDESK_API_URL, ZENDESK_API_USER, ZENDESK_API_TOKEN } = process.env

const main = async (req, res, next) => {
  // res.json(req.body);
  // const client = zendesk.createClient({
  //   username:  ZENDESK_API_USER,
  //   token:     'oauth_token',
  //   remoteUri: ZENDESK_API_URL,
  //   oauth: true,
  //   asUser: req.body.agent
  // });
  
  const client = zendesk.createClient({
    username:  ZENDESK_API_USER,
    token:     ZENDESK_API_TOKEN,
    remoteUri: ZENDESK_API_URL 
  });

  client.users.auth((err, req, result) => {
    if (err) {
      console.log(err);
      return;
    }
    res.json(JSON.stringify(result.verified, null, 2, true));
  });
}

export default main
