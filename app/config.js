/*
 * Copyright (c) 2021 Merlino Enterprise Sdn. Bhd.
 * All rights reserved.
 */

import fs from 'fs';

// Define constants
const DEFAULT_CONFIG_FILE_PATH = './config-default.json';
const EB_CONFIG_FILE_PATH = '/etc/trees/config.prod.json';

// Create the JSON configuration object
let result;
let defaultJson = {};

if (fs.existsSync(DEFAULT_CONFIG_FILE_PATH)) {
  const defaultContents = fs.readFileSync(DEFAULT_CONFIG_FILE_PATH);
  defaultJson = JSON.parse(defaultContents);
  result = defaultJson;
}

// LOCAL PRODUCTION or ELASTIC BEANSTALK
if (process.env.PROD && fs.existsSync(EB_CONFIG_FILE_PATH)) {
  const configContents = fs.readFileSync(EB_CONFIG_FILE_PATH);
  const configJson = JSON.parse(configContents);
  result = Object.assign(defaultJson, configJson);
}

// Export the configuration
export default result;
