"use strict";
const request = require("request");

const { Core } = require("@adobe/aio-sdk");
const {
  errorResponse,
  stringParameters,
  checkMissingRequestInputs,
} = require("../../../utils");

const stateLib = require("@adobe/aio-lib-state");
const THRESHOLD_COUNT = 15;
const openwhisk = require("openwhisk");
const { v4: uuid4 } = require("uuid");

async function checkJobStatus(params) {
  return new Promise(function (resolve, reject) {
    try {
      var options = {
        method: "GET",
        headers: {
          "x-api-key": params.apiKey,
          "x-gw-ims-org-id": params.imsOrg,
          Authorization: `Bearer ${params.token}`,
          Accept: "application/vnd.adobe.xed+json",
          "x-sandbox-name": params.sandbox.sandboxName || "prod",
        },
        url: `https://platform.adobe.io/data/core/ups/system/jobs/${params.id}`,
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
    logger.info("Calling the check-profile-job-status");

    // log parameters, only if params.LOG_LEVEL === 'debug'
    logger.debug(stringParameters(params));

    // check for missing request input parameters and headers
    const requiredParams = ["id"];
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
    // init when env vars __OW_API_KEY and __OW_NAMESPACE are set (e.g. when running in an OpenWhisk action)
    const state = await stateLib.init();
    var ow = openwhisk();

    const res = await state.get("accessToken"); // res = { value, expiration }
    const token = res.value;
    let invocationCount = params.invocationCount || 1;
    //Get Job status
    const jobResponse = await checkJobStatus({ ...params, token: token });

    //Job has not succeeded and have not reached max invocations
    if (jobResponse.status === "SUCCEEDED") {
      jobResponse["message"] = `Job succeed on ${THRESHOLD_COUNT} Invocations`;

      let payload = {
        name: `${process.env.__OW_ACTION_NAME.substring(
          1,
          process.env.__OW_ACTION_NAME.lastIndexOf("/")
        )}/post-batch-delete-Job`,
        params: {
          dataSetId: params.dataSetId,
          sandboxName: params.sandbox.sandboxName,
        },
      };
      const activation = await ow.actions.invoke(payload);
      jobResponse["batchDeleteJob"] = { activationID: activation.activationId };
    } else if (invocationCount < THRESHOLD_COUNT) {
      var now = new Date();
      now.setMinutes(now.getMinutes() + 1); //add a minute to current dateTime
      const jobId = uuid4();
      const id = jobResponse.id;
      const LOG_LEVEL = params.LOG_LEVEL;
      invocationCount++;
      const triggerParams = {
        date: `${now.toISOString()}`,
        deleteAfterFire: "rules",
        minutes: 1,
        trigger_payload: { ...jobResponse, invocationCount, LOG_LEVEL },
      };
      await ow.triggers.create({
        name: `${jobId}-check-job-trigger`,
      });

      await ow.rules.create({
        name: `${jobId}-check-job-trigger-rule`,
        action: process.env.__OW_ACTION_NAME,
        trigger: `${jobId}-check-job-trigger`,
      });

      await ow.feeds.create({
        name: "/whisk.system/alarms/once",
        trigger: `${jobId}-check-job-trigger`,
        params: triggerParams,
      });
    } else {
      jobResponse["status"] = "SUSPENDED";
      jobResponse[
        "message"
      ] = `Processing took more that ${THRESHOLD_COUNT} Invocations`;
    }

    // Update Profile Job ID batch state
    await state.put(`${params.dataSetId}-profile-job`, jobResponse);

    logger.info("jobResponse = " + JSON.stringify(jobResponse, null, 2));
    const response = {
      statusCode: 200,
      body: jobResponse,
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
