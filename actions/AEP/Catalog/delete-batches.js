"use strict";
const request = require("request");
const { Core } = require("@adobe/aio-sdk");
const {
  errorResponse,
  stringParameters,
  checkMissingRequestInputs,
} = require("../../utils");

const stateLib = require("@adobe/aio-lib-state");

const deleteBatch = async (params) => {
  return new Promise(function (resolve, reject) {
    try {
      var options = {
        method: "POST",
        headers: {
          "x-api-key": params.apiKey,
          "x-gw-ims-org-id": params.imsOrg,
          Authorization: `Bearer ${params.token}`,
          "x-sandbox-name": params.sandboxName || "prod",
        },
        url: `https://platform.adobe.io/data/foundation/import/batches/${params.batchID}?action=REVERT`,
      };
      request(options, function (error, response, body) {
        if (error) reject(error);
        else {
          resolve({ statusCode: 200, body: `Deleted ${params.batchID}` });
        }
      });
    } catch (e) {
      reject(e);
    }
  });
};

// main function that will be executed by Adobe I/O Runtime
async function main(params) {
  // create a Logger
  const logger = Core.Logger("main", { level: params.LOG_LEVEL || "info" });

  try {
    // 'info' is the default level if not set
    logger.info("Calling the delete-batches");

    // log parameters, only if params.LOG_LEVEL === 'debug'
    logger.debug(stringParameters(params));

    // check for missing request input parameters and headers
    const requiredParams = [
      "apiKey",
      "sandboxName",
      "imsOrg",
      "batchesToDelete",
      "sandboxName",
    ];
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
    let res = await state.get("accessToken");
    const token = res.value;

    const getData = async () => {
      return Promise.all(
        params.batchesToDelete.map((batchID) =>
          deleteBatch({ ...params, batchID: batchID, token: token })
        )
      );
    };
    const data = await getData();
    logger.debug("data = " + JSON.stringify(data, null, 2));
    const response = {
      statusCode: 200,
      body: data,
    };

    // log the response status code
    logger.info(`${response.statusCode}: successful request`);

    return response;
  } catch (error) {
    // log any server errors
    logger.error(error);
    // return with 500
    return errorResponse(500, "server error", logger);
  }
}

exports.main = main;
