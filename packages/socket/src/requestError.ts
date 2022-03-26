class RequestError extends Error {
  object: string;

  constructor(message: string) {
    super(`request: ${message}`);

    this.object = message;
  }
}

export default RequestError;
