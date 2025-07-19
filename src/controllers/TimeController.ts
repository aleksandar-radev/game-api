import { Response } from 'express';
import { Controller, Get, Res, HttpCode } from 'routing-controllers';
import { Service } from 'typedi';

@Controller('/time')
@Service()
export class TimeController {
  @Get('/')
  @HttpCode(200)
  getCurrentTime(@Res() res: Response) {
    const now = new Date();
    const utcDatetime = now.toISOString();
    const unixtime = now.getTime();

    return {
      abbreviation: 'UTC',
      client_ip: res.req.ip,
      datetime: utcDatetime,
      unixtime,
      timezone: 'Etc/UTC',
      utc_offset: '+00:00',
    };
  }
}