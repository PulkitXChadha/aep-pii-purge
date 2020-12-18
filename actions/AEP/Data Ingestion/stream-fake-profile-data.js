"use strict";
const request = require("request");
const { Core } = require("@adobe/aio-sdk");
const {
  errorResponse,
  stringParameters,
  checkMissingRequestInputs,
} = require("../../utils");

const fakeGen = require("../../services/get-fake-profile-data");

async function sendDataToAEP(params) {
  // create a Logger
  const logger = Core.Logger("sendDataToAEP", {
    level: params.LOG_LEVEL || "info",
  });

  let body = {
    header: {
      schemaRef: {
        id: `${params.schemaRef}`,
        contentType: "application/vnd.adobe.xed-full+json;version=1",
      },
      imsOrgId: `${params.imsOrg}`,
      source: {
        name: "GettingStarted",
      },
      datasetId: `${params.dataSetId}`,
    },
    body: {
      xdmMeta: {
        schemaRef: {
          id: `${params.schemaRef}`,
          contentType: "application/vnd.adobe.xed-full+json;version=1",
        },
      },
      xdmEntity: params.payload,
    },
  };

  return new Promise(function (resolve, reject) {
    try {
      var options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "x-sandbox-name": params.sandboxName || "prod",
        },
        url: params.inletUrl,
        body: JSON.stringify(body),
      };

      logger.debug("options = " + JSON.stringify(options, null, 2));
      request(options, function (error, response, body) {
        if (error) reject(error);
        else {
          resolve(body);
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
    logger.info("Calling the stream-data");

    // log parameters, only if params.LOG_LEVEL === 'debug'
    logger.debug(stringParameters(params));

    // check for missing request input parameters and headers
    const requiredParams = [
      "inletUrl",
      "sandboxName",
      "imsOrg",
      "dataSetId",
      "schemaRef",
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

    const payload = await fakeGen.getFakeProfile();

    const response = await sendDataToAEP({
      ...params,
      payload: payload,
    });
    return {
      statusCode: 200,
      body: { response: JSON.parse(response), payload: payload },
    };
  } catch (error) {
    // log any server errors
    logger.error(error);
    // return with 500
    return errorResponse(500, "server error", logger);
  }
}

exports.main = main;
