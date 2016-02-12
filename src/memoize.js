// copypasted from rackt/reselect
const defaultEqualityCheck = (a, b) => a === b;

export default (func, equalityCheck = defaultEqualityCheck) => {
  let lastArgs = null;
  let lastResult = null;

  return (...args) => {
    if (
      lastArgs !== null &&
      lastArgs.length === args.length &&
      args.every((value, index) => equalityCheck(value, lastArgs[index]))
    ) {
      return lastResult;
    }
    lastArgs = args;
    lastResult = func(...args);
    return lastResult;
  };
};
