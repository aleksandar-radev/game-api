import { Request, Response } from "express";
import config from "../config/config";

// Assuming `config.pagination.defaultPage` and `config.pagination.defaultLimit` are numbers.
export const getPaginationOptions = (
  req: Request
): { page: number; limit: number } => {
  const page =
    req.query.page !== undefined
      ? parseInt(req.query.page as string, 10)
      : config.pagination.defaultPage;
  const limit =
    req.query.pageSize !== undefined
      ? parseInt(req.query.pageSize as string, 10)
      : config.pagination.defaultLimit;

  return { page, limit };
};

interface PaginationResult {
  total: number;
  page: number;
  limit: number;
}

export const setPaginationHeaders = (
  res: Response,
  result: PaginationResult
): void => {
  // Ensure values are converted to strings for response headers
  res.set("Pagination-Count", result.total.toString());
  res.set("Pagination-Page", result.page.toString());
  res.set("Pagination-Limit", result.limit.toString());
};

export default { getPaginationOptions, setPaginationHeaders };
