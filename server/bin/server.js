#! /usr/bin/env node

import Rollbar from 'rollbar';
import getApp from '../index.js';

const rollbar = new Rollbar({
  accessToken: process.env.ROLLBAR_ACCESS_TOKEN,
  captureUncaught: true,
  captureUnhandledRejections: true,
});

const port = process.env.PORT || 5000;
const address = '0.0.0.0';

getApp().listen(port, address, (err) => {
  if (err) {
    rollbar.error(err);
    console.error(err);
    process.exit(1);
  }
  console.log(`Server is running on port: ${port}`);
});
