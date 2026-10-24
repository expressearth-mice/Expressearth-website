const DEFAULT_API_URL = "https://api.expressearth.com";

const BASE_URL = (process.env.REACT_APP_API_URL?.trim() || DEFAULT_API_URL).replace(
  /\/+$/,
  ""
);

const config = { BASE_URL };

export default config;
