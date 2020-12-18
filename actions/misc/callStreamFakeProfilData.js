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
  name: "pii-cleanup-0.0.1/stream-fake-profile-data",
  params: {
    apiKey: process.env.SERVICE_API_KEY,
    sandboxName: "pii-clean-up-dev",
    dataSetId: "5fbd023e7895c51958d8f215",
    imsOrg: process.env.IMS_ORG,
    inletUrl:
      "https://dcs.adobedc.net/collection/7d4ee64969f4d7b03260316b571d31b8e30687bd44cd1d8466f2c8faf35afedf?synchronousValidation=true",
    schemaRef:
      "https://ns.adobe.com/microsoftdemos1/schemas/9df5dc99e4696d862914b75955e9f17d24413573bbe9d3f",
  },
};
ow.actions.invoke(payload).then((result) => console.log(result));

// const fakeGen = require("../services/get-fake-profile-data");
// const payload = fakeGen.getFakeProfile().then((h) => console.log(h));
