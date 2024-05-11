// Function to parse an error string related to an Ethereum transaction.
// It expects 'errorString' as the input, which is the error message containing the error object.
// The function extracts the JSON-formatted error object from the 'errorString'.
// It then splits the extracted object into two parts: 'errorPart' and 'payloadPart'.
// 'errorPart' contains the error code and message, while 'payloadPart' contains additional payload data.
// The function returns an object with 'jsonErrorPart' and 'jsonPayloadPart' properties.
// 'jsonErrorPart' is the parsed error object (containing 'code' and 'message' properties),
// and 'jsonPayloadPart' is the unparsed payload part of the error object.
export const parseEthTransactionError = (errorString: any) => {
  // Find the starting and ending index of the error object within the 'errorString'.
  const startIndex = errorString.indexOf('{');
  const endIndex = errorString.lastIndexOf('}') + 1;

  // Extract the error object from the 'errorString' using the start and end index.
  const errorObject = errorString.substring(startIndex, endIndex);

  // Split the extracted error object into 'errorPart' and 'payloadPart' based on the '},' delimiter.
  const parts = errorObject.split('},');
  if (parts.length !== 2) {
    console.log(
      'Invalid format: The provided data is not in the correct format.',
    );
  }

  // Combine the 'errorPart' and 'payloadPart' to form valid JSON objects.
  const errorPart = parts[0] + '}';
  const jsonPayloadPart = '{' + parts[1];

  // Parse the 'errorPart' as a JSON object to obtain the error details (code and message).
  let jsonErrorPart;

  try {
    jsonErrorPart = JSON.parse(errorPart);
  } catch (error) {}

  // 'payloadPart' remains unparsed, and the function returns both 'jsonErrorPart' and 'jsonPayloadPart'.
  return { jsonErrorPart, jsonPayloadPart };
};
