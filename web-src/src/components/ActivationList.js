/** @jsx jsx */
import { css, jsx } from "@emotion/react";
import PropTypes from "prop-types";
import {
  Text,
  Item as SpectrumTab,
  ProgressCircle,
  ListBox,
  Section,
} from "@adobe/react-spectrum";

import Event from "@spectrum-icons/workflow/Event";
import { useActionWebInvoke } from "../hooks/useActionWebInvoke";

const ActivationList = (props) => {
  let headers = {};
  let suppressList = [
    "get-activation-log",
    "app-registry",
    "get-activation-list",
    "get-all-state",
    "__secured_get-activation-log",
    "__secured_app-registry",
    "__secured_get-activation-list",
    "__secured_get-all-state",
  ];
  if (props.ims.token && !headers.authorization) {
    headers.authorization = `Bearer ${props.ims.token}`;
  }
  if (props.ims.org && !headers["x-gw-ims-org-id"]) {
    headers["x-gw-ims-org-id"] = props.ims.org;
  }

  let activationList = useActionWebInvoke({
    actionName: "get-activation-list",
    headers: headers,
    params: {},
    cacheResponse: false,
  });

  let activationListContent = (
    <ProgressCircle
      id="activation-list-progress-circle"
      aria-label="Getting Activation List"
      isIndeterminate
      isHidden={!activationList.isLoading}
      marginStart="size-100"
    />
  );

  if (!activationList.isLoading && activationList.error) {
    activationListContent = <Text>No Activation Logs Found</Text>;
  }
  if (
    !activationList.data &&
    !activationList.error &&
    !activationList.isLoading
  ) {
    activationListContent = <Text>No Activation Logs Found</Text>;
  }
  if (!activationList.isLoading && activationList.data) {
    activationListContent = (
      <div
        css={css`
          height: calc(100vh - 80px);
          overflow: auto;
        `}
      >
        <ListBox
          onSelectionChange={(id) => {
            props.onSelection(id.currentKey);
          }}
          aria-label="Options"
          selectionMode="single"
        >
          <Section title="Activation List">
            {activationList.data
              .sort((a, b) => b.end - a.end)
              .filter((activation) => !suppressList.includes(activation.name))
              .map((activation) => (
                <SpectrumTab
                  key={activation.activationId}
                  textValue={activation.name}
                >
                  <Event size="S" />
                  <Text>{activation.name || ""}</Text>
                  <Text slot="description">
                    {new Date(activation.end).toString()}
                  </Text>
                </SpectrumTab>
              ))}
          </Section>
        </ListBox>
      </div>
    );
  }

  return activationListContent;
};

ActivationList.propTypes = {
  runtime: PropTypes.any,
  ims: PropTypes.any,
};

export default ActivationList;
