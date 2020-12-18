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
  name: "pii-cleanup-0.0.1/delete-batches",
  params: {
    LOG_LEVEL: "debug",
    apiKey: "1d36ddc84716446e834c8e79ffddbe22",
    batchesToDelete: [
      "01ERPX0A9Y74WR0B2CV94Y4Y14",
      "01EQY6GWQJ925FGYPTCSTD57Y7",
      "01EQY4EB4YRDYB8GX675AEJ8DD",
    ],
    dataSetId: "5fbd023e7895c51958d8f215",
    imsOrg: "46273A4A5F2302D10A495E50@AdobeOrg",
    lastSuccessfulRun: 1559775880000,
    sandboxName: "pii-clean-up-dev",
  },
};
ow.actions.invoke(payload).then((result) => console.log(result));
