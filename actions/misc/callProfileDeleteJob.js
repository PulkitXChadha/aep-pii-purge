const openwhisk = require("openwhisk");
require("dotenv").config();

var options = {
  apihost: process.env.AIO_runtime_apihost,
  namespace: process.env.AIO_runtime_namespace,
  api_key: process.env.AIO_runtime_auth,
};
var ow = openwhisk(options);

// Test PII clean up dev
let payload = {
  name: "pii-cleanup-0.0.1/post-profile-delete-job",
  params: {
    apiKey: process.env.SERVICE_API_KEY,
    sandboxName: "pii-clean-up-dev",
    dataSetId: "5fbd023e7895c51958d8f215",
    imsOrg: process.env.IMS_ORG,
  },
};
ow.actions.invoke(payload).then((result) => console.log(result));
