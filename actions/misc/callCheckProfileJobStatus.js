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
  name: "pii-cleanup-0.0.1/check-profile-job-status",
  params: {
    id: "704dc49d-c10a-44ca-9ba5-cd12e49b1aba",
    imsOrgId: "46273A4A5F2302D10A495E50@AdobeOrg",
    sandbox: {
      sandboxId: "4a08a06b-8652-44d7-88a0-6b865264d78b",
      sandboxName: "pii-clean-up-dev",
      type: "development",
      default: false,
    },
    source: "api",
    dataSetId: "5fbd023e7895c51958d8f215",
    action: "DELETE",
    status: "SUCCEEDED",
    metrics: '{"successRecords":2,"failedRecords":0,"timeTakenInSec":279}',
    createEpoch: 1607086812,
    updateEpoch: 1607087146,
  },
};
ow.actions.invoke(payload).then((result) => console.log(result));
