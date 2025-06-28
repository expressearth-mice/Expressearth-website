const ENV = process.env.REACT_APP_ENV || 'local';

const config = {
  local: {
    BASE_URL: 'https://express-earth-backend-service-929452209573.asia-south2.run.app',
  },
  qa: {
    BASE_URL: 'https://qa.api.example.com/api',
  },
  stage: {
    BASE_URL: 'https://stage.api.example.com/api',
  },
  prod: {
    BASE_URL: 'https://api.example.com/api',
  },
};
if (!config[ENV]) {
  throw new Error(`Invalid REACT_APP_ENV: ${ENV}`);
}
export default config[ENV];