export default (authorizationHeader?: string) => {
  if (authorizationHeader) {
    const token = authorizationHeader.split(" ")[1]; // Assuming the header value is in the format "Bearer <token>"

    return token;
  }

  return null; // Return null if the header is missing
};
