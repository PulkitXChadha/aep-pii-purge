"use strict";

const { Core } = require("@adobe/aio-sdk");
const {
  errorResponse,
  stringParameters,
  checkMissingRequestInputs,
} = require("../utils");

const stateLib = require("@adobe/aio-lib-state");
const openwhisk = require("openwhisk");
// main function that will be executed by Adobe I/O Runtime
async function main(params) {
  // create a Logger
  const logger = Core.Logger("main", { level: params.LOG_LEVEL || "info" });

  try {
    // 'info' is the default level if not set
    logger.info("Calling the post-profile-delete-job");

    // log parameters, only if params.LOG_LEVEL === 'debug'
    logger.debug(stringParameters(params));

    // check for missing request input parameters and headers
    const requiredParams = ["dataSetId"];
    const requiredHeaders = [];
    const errorMessage = checkMissingRequestInputs(
      params,
      requiredParams,
      requiredHeaders
    );
    if (errorMessage) {
      // return and log client errors
      return errorResponse(400, errorMessage, logger);
    }

    const state = await stateLib.init();

    var ow = openwhisk();
    var jobResponse = [];
    const datasets = params.dataSetId.split(",");
    datasets.map(async (dataset) => {
      let payload = {
        name: `${process.env.__OW_ACTION_NAME.substring(
          1,
          process.env.__OW_ACTION_NAME.lastIndexOf("/")
        )}/post-clean-up-job`,
        params: {
          dataSetId: dataset,
        },
      };
      const activation = await ow.actions.invoke(payload);
      jobResponse.push({
        dataset: dataset,
        activationID: activation.activationId,
      });
    });

    return jobResponse;
  } catch (error) {
    // log any server errors
    logger.error(error);
    // return with 500
    return errorResponse(500, JSON.stringify(error), logger);
  }
}

exports.main = main;
