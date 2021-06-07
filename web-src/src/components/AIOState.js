import PropTypes from "prop-types";
import React, { useState } from "react";
import { Heading, ActionButton, View, Text, Flex } from "@adobe/react-spectrum";
import ReactCardFlip from "react-card-flip";

const AIOState = (props) => {
  time = (ms) => {
    return new Date(ms).toISOString().slice(11, -1);
  };

  const [flipped, setFlipped] = useState(false);
  let now = new Date();
  let expiresIn = new Date(props.stateExpiration);
  let frontCard = (
    <View>
      <Heading level={4}>{`${props.stateKey}`}</Heading>
      <Heading level={5}>{`${time(expiresIn - now)}`}</Heading>
    </View>
  );

  let backCard = (
    <View>
      <Text>{`${props.stateValue}`}</Text>
    </View>
  );

  return (
    <View
      backgroundColor="gray-75"
      borderWidth="thin"
      borderColor="dark"
      borderRadius="regular"
      overflow="auto"
    >
      <Flex
        marginTop="size-100"
        marginStart="size-100"
        marginBottom="size-100"
        direction="column"
      >
        <ReactCardFlip isFlipped={flipped} flipDirection="vertical">
          {frontCard}
          {backCard}
        </ReactCardFlip>
        <ActionButton onPress={() => setFlipped(!flipped)}>
          {flipped ? "Hide" : "Show"} Value
        </ActionButton>
      </Flex>
    </View>
  );
};

AIOState.propTypes = {
  runtime: PropTypes.any,
  ims: PropTypes.any,
};

export default AIOState;
