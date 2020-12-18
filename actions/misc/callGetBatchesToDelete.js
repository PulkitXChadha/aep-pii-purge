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
  name: "pii-cleanup-0.0.1/get-batches-to-delete",
  params: {
    sandboxName: "pii-clean-up-dev",
    dataSetId: "5fbd023e7895c51958d8f215",
    imsOrg: process.env.IMS_ORG,
    apiKey: process.env.SERVICE_API_KEY,
    lastSuccessfulRun: 1559775880000,
  },
};
ow.actions.invoke(payload).then((result) => console.log(result));

// const data = {
//   "01ERPX0A9Y74WR0B2CV94Y4Y14": {
//     id: "01ERPX0A9Y74WR0B2CV94Y4Y14",
//   },
//   "01EQY6ZZAEZ10TSED2GM7G1MGM": {
//     id: "01EQY6ZZAEZ10TSED2GM7G1MGM",
//     replay: {
//       reason: "revert",
//     },
//   },
//   "01EQY6GWQJ925FGYPTCSTD57Y7": {
//     id: "01EQY6GWQJ925FGYPTCSTD57Y7",
//   },
//   "01EQY530AHJJ1VCXYA5EP66WSM": {
//     id: "01EQY530AHJJ1VCXYA5EP66WSM",
//     replay: {
//       reason: "revert",
//     },
//   },
//   "01EQY530ADMFKQD7ZXANBRK5Q3": {
//     id: "01EQY530ADMFKQD7ZXANBRK5Q3",
//     replay: {
//       reason: "revert",
//     },
//   },
//   "01EQY530ACZ8CPAX74CRYCYEPW": {
//     id: "01EQY530ACZ8CPAX74CRYCYEPW",
//     replay: {
//       reason: "revert",
//     },
//   },
//   "01EQY530AGAGBVJ935GBR7DTJN": {
//     id: "01EQY530AGAGBVJ935GBR7DTJN",
//     replay: {
//       reason: "revert",
//     },
//   },
//   "01EQY530AQ823SGKPV75QSWD8Y": {
//     id: "01EQY530AQ823SGKPV75QSWD8Y",
//     replay: {
//       reason: "revert",
//     },
//   },
//   "01EQY530AT4NWC9HP8HK8QHAZJ": {
//     id: "01EQY530AT4NWC9HP8HK8QHAZJ",
//     replay: {
//       reason: "revert",
//     },
//   },
//   "01EQY4EB4YRDYB8GX675AEJ8DD": {
//     id: "01EQY4EB4YRDYB8GX675AEJ8DD",
//   },
//   "01EQY40Q9DK2G0F0J5GYWP4G4B": {
//     id: "01EQY40Q9DK2G0F0J5GYWP4G4B",
//     replay: {
//       reason: "revert",
//     },
//   },
//   "01EQY40Q9A53MZEFMRDE86HF1N": {
//     id: "01EQY40Q9A53MZEFMRDE86HF1N",
//     replay: {
//       reason: "revert",
//     },
//   },
//   "01EQY40Q9GGN10E1J1SXE2SVCG": {
//     id: "01EQY40Q9GGN10E1J1SXE2SVCG",
//     replay: {
//       reason: "revert",
//     },
//   },
//   "01EQY40Q7G2J22XKHH8AWZK81Z": {
//     id: "01EQY40Q7G2J22XKHH8AWZK81Z",
//     replay: {
//       reason: "revert",
//     },
//   },
//   "01EQY40Q7PHCRR44JW2NTBYFNN": {
//     id: "01EQY40Q7PHCRR44JW2NTBYFNN",
//     replay: {
//       reason: "revert",
//     },
//   },
//   "01EQY3XS6R20G5T6MSETJDZY6S": {
//     id: "01EQY3XS6R20G5T6MSETJDZY6S",
//     replay: {
//       reason: "revert",
//     },
//   },
//   "01EQY3XS663WPCR0ZWS1ZPF6P2": {
//     id: "01EQY3XS663WPCR0ZWS1ZPF6P2",
//     replay: {
//       reason: "revert",
//     },
//   },
//   "01EQY3XS67ST4F94AGYMBP047K": {
//     id: "01EQY3XS67ST4F94AGYMBP047K",
//     replay: {
//       reason: "revert",
//     },
//   },
//   "01EQY3XS4ABNZ897ANMGYDXWPG": {
//     id: "01EQY3XS4ABNZ897ANMGYDXWPG",
//     replay: {
//       reason: "revert",
//     },
//   },
//   "01EQY3XS1XM45T5C7AVXWT3FNH": {
//     id: "01EQY3XS1XM45T5C7AVXWT3FNH",
//     replay: {
//       reason: "revert",
//     },
//   },
// };

// const batchesToDelete = Object.keys(data)
//   .filter((batchID) => ((data[batchID].replay || {}).reason || {}) != "revert")
//   .map((batchID) => batchID);
// console.log(`batchesToDelete = ${batchesToDelete}`);
