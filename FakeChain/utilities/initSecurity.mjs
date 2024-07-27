import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';

export const initSecurity = (app) => {
  app.use(cors());

  app.use(helmet());

  app.use(hpp());

  app.use(mongoSanitize());

  app.use(xss());
};
