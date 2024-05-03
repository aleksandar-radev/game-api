import { Request, Response } from "express";
import { BadRequestError } from "./error";

interface PaginationResult {
  total: number;
  page: number;
  pageSize: number;
}

const defaultPage = 1;
const defaultPageSize = 10;

export const pagination = {
  getPaginationOptions: (
    req: Request
  ): { page: number; pageSize: number; offset: number } => {
    const page =
      req.query.page !== undefined
        ? parseInt(req.query.page as string, 10)
        : defaultPage;
    const pageSize =
      req.query.pageSize !== undefined
        ? parseInt(req.query.pageSize as string, 10)
        : defaultPageSize;

    if (page < 1 || pageSize < 1) {
      throw new BadRequestError("Invalid pagination options");
    }

    return { page, pageSize, offset: (page - 1) * pageSize };
  },
  setPaginationHeaders: (res: Response, result: PaginationResult): void => {
    // Ensure values are converted to strings for response headers
    res.set("Pagination-Count", result.total.toString());
    res.set("Pagination-Page", result.page.toString());
    res.set("Pagination-PageSize", result.pageSize.toString());
  },
};
