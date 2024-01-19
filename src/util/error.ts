import { Alert } from 'react-native';

/**
 * Catch rejected promises and show an alert with the reason to the user
 * @param reason given from promise reject
 */
export default function showErrorDialog(reason: any) {
  // the promise reject gives us "any" type for `reason` so we are forced to use it here
  Alert.alert('Internal Error', reason.toString());
}

/**
 * Most common JS errors:
 * - ReferenceError (referenced value that doesn't exist)
 * - TypeError (value is wrong type)
 * - SyntaxError (code is syntactically wrong)
 */