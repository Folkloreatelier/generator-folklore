/* eslint-disable global-require */
const configureStore = __DEV__ ? require('./configureStore.dev') : require('./configureStore.prod');

export default configureStore;
