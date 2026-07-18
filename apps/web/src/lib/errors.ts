export class AppError extends Error {
  statusCode: number;
  code: string;

  constructor(message: string, statusCode: number, code: string) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
  }
}

export class AuthError extends AppError {
  constructor(message = "Authentication required") {
    super(message, 401, "AUTH_ERROR");
    this.name = "AuthError";
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404, "NOT_FOUND");
    this.name = "NotFoundError";
  }
}

export class TransactionError extends AppError {
  txHash: string;

  constructor(message: string, txHash: string) {
    super(message, 500, "TRANSACTION_ERROR");
    this.name = "TransactionError";
    this.txHash = txHash;
  }
}
