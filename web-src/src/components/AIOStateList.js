import PropTypes from "prop-types";
import React from "react";
import {
  Text,
  ProgressCircle,
  Heading,
  repeat,
  Grid,
  Flex,
  Divider,
  View,
} from "@adobe/react-spectrum";

import AIOState from "./AIOState";
import { useActionWebInvoke } from "../hooks/useActionWebInvoke";

const AIOStateList = (props) => {
  const allState = useActionWebInvoke({
    actionName: "get-all-state",
    headers: {},
    params: {},
  });
  let stateList = (
    <ProgressCircle
      id="sandbox-list-progress-circle"
      aria-label="Getting Sandboxes"
      isIndeterminate
      isHidden={!allState.isLoading}
      marginStart="size-100"
    />
  );

  let headerContent = (
    <Grid
      areas={["header header header header addButton"]}
      columns={["1fr", "1fr", "1fr", "1fr", "1fr"]}
      rows={["size-600"]}
      height="100%"
      columnGap="size-300"
    >
      <View gridArea="header">
        <Heading level={3}>Adobe I/O State Storage</Heading>
      </View>
    </Grid>
  );

  if (allState.error) {
    stateList = <Text>{allState.error.message}</Text>;
  }

  if (!allState.data && !allState.error && !allState.isLoading) {
    stateList = <Text>You have no allState !</Text>;
  }

  if (allState.data && allState.data.keys[0]) {
    stateList = (
      <Grid
        columns={repeat("auto-fit", "19%")}
        justifyContent="center"
        gap="size-100"
      >
        {allState.data.keys.map((element) => (
          <AIOState
            stateKey={element.key}
            stateValue={element.value}
            stateExpiration={element.expiration}
          />
        ))}
      </Grid>
    );
  }

  return (
    <Flex direction="column" gap="size-50">
      {headerContent}
      <Divider size="M" />
      {stateList}
    </Flex>
  );
};

AIOStateList.propTypes = {
  runtime: PropTypes.any,
  ims: PropTypes.any,
};

export default AIOStateList;
