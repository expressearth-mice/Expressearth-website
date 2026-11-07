export const isSuccessfulContactResponse = (response) => {
  const successValue = response?.data?.success;

  return (
    successValue === true ||
    (typeof successValue === "string" &&
      successValue.trim() !== "" &&
      successValue.trim().toLowerCase() !== "false")
  );
};
