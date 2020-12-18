"use strict";
const request = require("request");
const { Core } = require("@adobe/aio-sdk");
const {
  errorResponse,
  stringParameters,
  checkMissingRequestInputs,
} = require("../../../utils");

const stateLib = require("@adobe/aio-lib-state");

async function submitProjectDeleteJob(params) {
  return new Promise(function (resolve, reject) {
    try {
      var options = {
        method: "POST",
        headers: {
          "x-api-key": params.apiKey,
          "x-gw-ims-org-id": params.imsOrg,
          Authorization: `Bearer ${params.token}`,
          Accept: "application/vnd.adobe.xed+json",
          "x-sandbox-name": params.sandboxName || "prod",
        },
        url: "https://platform.adobe.io/data/core/ups/system/jobs",
        body: JSON.stringify({ dataSetId: params.dataSetId }),
      };
      request(options, function (error, response, body) {
        if (error) reject(error);
        else {
          resolve(JSON.parse(body));
        }
      });
    } catch (e) {
      reject(e);
    }
  });
}

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
    const requiredParams = ["apiKey", "sandboxName", "dataSetId", "imsOrg"];
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
    const res = await state.get("accessToken"); // res = { value, expiration }
    const token = res.value;

    const jobResponse = await submitProjectDeleteJob({
      ...params,
      token: token,
    });

    logger.info("jobID = " + JSON.stringify(jobResponse, null, 2));
    await state.put(`${jobResponse.ID}-profile-job`, jobResponse); // Create Profile Job ID batch state

    // log the response status code
    logger.info(`${jobResponse.statusCode}: successful request`);
    return jobResponse;
  } catch (error) {
    // log any server errors
    logger.error(error);
    // return with 500
    return errorResponse(500, "server error", logger);
  }
}

exports.main = main;
