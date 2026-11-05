const PRODUCTION_HOSTS = new Set(["expressearth.com", "www.expressearth.com"]);

export const isExpressEarthProductionHost = (hostname) => {
  if (typeof hostname !== "string") return false;
  return PRODUCTION_HOSTS.has(hostname.trim().toLowerCase().replace(/\.$/, ""));
};
