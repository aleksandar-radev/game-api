import { Request } from 'express';

export const getSortingOptions = (req: Request): Record<string, string> => {
  if (typeof req.query.sort === 'string') {
    return {
      sort: req.query.sort.replace(/,/g, ' '),
    };
  } else {
    return {};
  }
};
