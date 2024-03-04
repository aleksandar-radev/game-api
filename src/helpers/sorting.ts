import { Request } from "express";

export const getSortingOptions = (req: Request): Record<string, string> => {
  // Check if `sort` exists and is a string before attempting to replace characters
  if (typeof req.query.sort === "string") {
    return {
      sort: req.query.sort.replace(",", " "),
    };
  } else {
    return {};
  }
};
