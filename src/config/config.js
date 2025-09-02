const ENV = process.env.REACT_APP_ENV || 'local';

const config = {
  local: {
    BASE_URL: 'http://localhost:8000',
  },
  qa: {
    BASE_URL: 'https://express-earth-backend-service-929452209573.asia-south2.run.app',
  },
  stage: {
    BASE_URL: 'https://express-earth-backend-service-929452209573.asia-south2.run.app',
  },
  prod: {
    BASE_URL: 'https://api.expressearth.com',
  },
};
if (!config[ENV]) {
  throw new Error(`Invalid REACT_APP_ENV: ${ENV}`);
}
export default config[ENV];