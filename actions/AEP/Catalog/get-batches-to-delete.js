"use strict";
const request = require("request");
const { Core } = require("@adobe/aio-sdk");
const {
  errorResponse,
  stringParameters,
  checkMissingRequestInputs,
} = require("../../utils");

const stateLib = require("@adobe/aio-lib-state");
require("dotenv").config();

async function getBatchedToDelete(params) {
  // create a Logger
  const logger = Core.Logger("getBatchedToDelete", {
    level: params.LOG_LEVEL || "info",
  });
  return new Promise(function (resolve, reject) {
    try {
      var options = {
        method: "GET",
        headers: {
          "x-api-key": params.apiKey,
          "x-gw-ims-org-id": params.imsOrg,
          Authorization: `Bearer ${params.token}`,
          Accept: "application/vnd.adobe.xed+json",
          "x-sandbox-name": params.sandboxName || "prod",
        },
        url: `https://platform.adobe.io/data/foundation/catalog/batches?createdAfter=${params.lastSuccessfulRun}&orderBy=desc:created&dataSet=${params.dataSetId}&properties=id,replay.reason&createdClient=acp_foundation_push`,
      };

      logger.debug("options = " + JSON.stringify(options, null, 2));
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
    logger.info("Calling the get-batches-to-delete");

    // log parameters, only if params.LOG_LEVEL === 'debug'
    logger.debug(stringParameters(params));

    // check for missing request input parameters and headers
    const requiredParams = ["apiKey", "imsOrg", "sandboxName", "dataSetId"];
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

    const nowEpoch = new Date().getTime();

    const state = await stateLib.init();
    const res = await state.get("accessToken");
    const token = res.value;

    // get Last Run Time
    const lastSuccessfulRun = params.lastSuccessfulRun
      ? params.lastSuccessfulRun
      : (await state.get("lastSuccessfulRun")).value || 1559775880000;

    const data = await getBatchedToDelete({
      ...params,
      token: token,
      lastSuccessfulRun: lastSuccessfulRun,
    });

    logger.debug("data = " + JSON.stringify(data, null, 2));
    const batchesToDelete = Object.keys(data)
      .filter(
        (batchID) => ((data[batchID].replay || {}).reason || {}) != "revert"
      )
      .map((batchID) => batchID);

    logger.debug(
      "batchesToDelete = " + JSON.stringify(batchesToDelete, null, 2)
    );

    const response = {
      statusCode: 200,
      body: batchesToDelete,
    };

    await state.put("lastSuccessfulRun", nowEpoch, { ttl: -1 }); // Update Last run time

    return { ...params, batchesToDelete: batchesToDelete };
  } catch (error) {
    // log any server errors
    logger.error(error);
    // return with 500
    return errorResponse(500, "server error", logger);
  }
}

exports.main = main;
