export type ErrorActionResult = {
  success: false;
  message: string;
  errors?: Record<string, unknown>;
  code: string;
};

export type SuccessActionResult = {
  success: true;
};

export type ActionResult = SuccessActionResult | ErrorActionResult;
