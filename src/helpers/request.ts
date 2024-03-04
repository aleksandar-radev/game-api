import { Request } from "express";
import * as pagination from "./pagination";
import * as sorting from "./sorting";

// Assuming `getPaginationOptions` and `getSortingOptions` return objects of a known structure,
// you might want to define those structures. If they're dynamic, you could use `Record<string, unknown>`.

export const getRequestOptions = (req: Request): Record<string, any> => {
  const paginationOptions = pagination.getPaginationOptions(req);
  const sortOptions = sorting.getSortingOptions(req);

  return { ...paginationOptions, ...sortOptions };
};

export const getFilteringOptions = (
  req: Request,
  parameters: string[]
): Record<string, any> => {
  let options: Record<string, any> = {};

  parameters.forEach((param) => {
    if (req.query[param] !== undefined) {
      options[param] = req.query[param];
    }
  });

  return options;
};

export default { getRequestOptions, getFilteringOptions };
