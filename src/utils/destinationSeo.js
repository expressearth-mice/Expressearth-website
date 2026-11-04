export const buildDestinationSeoMetadata = (destinationName) => {
  const name = String(destinationName || "").trim();
  if (!name) return null;

  return {
    title: `Corporate Group Travel in ${name} | ExpressEarth`,
    description: `Corporate group travel and incentive programme planning for ${name}. Discuss hotels, transfers, activities and on-ground logistics with ExpressEarth.`,
  };
};
