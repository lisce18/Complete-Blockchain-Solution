import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import { rateLimit } from 'express-rate-limit';

export const initSecurity = (app) => {
  app.use(cors());

  app.use(helmet());

  app.use(hpp());

  // const limit = rateLimit({
  //   windowsMs: 15 * 60 * 1000,
  //   max: 100,
  // });
  // app.use(limit);

  app.use(mongoSanitize());

  app.use(xss());
};
