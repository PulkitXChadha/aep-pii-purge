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
  name: "pii-cleanup-0.0.1/post-clean-up-job",
  params: {
    dataSetId: "5fbd023e7895c51958d8f215",
    sandboxName: "pii-clean-up-dev",
    lastSuccessfulRun: 1559775880000,
  },
};
ow.actions.invoke(payload).then((result) => console.log(result));
