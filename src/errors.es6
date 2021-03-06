export class DolphinRemotingError extends Error {
  constructor(message = 'Network Error', detail) {
    super(message);
    this.detail = detail || undefined;
  }
}

export class DolphinSessionError extends Error {
  constructor(message = 'Session Error') {
    super(message);
  }
}

export class HttpResponseError extends Error {
  constructor(message = 'Http Response Error') {
    super(message);
  }
}