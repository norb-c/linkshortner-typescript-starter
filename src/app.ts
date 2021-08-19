import * as cors from 'cors';
import * as express from 'express';
import * as helmet from 'helmet';
import * as hpp from 'hpp';
import * as logger from 'morgan';
import { Errors } from './constants/errors';
import { handleErrors } from './middlewares/error.middleware';
import { sequelize } from './models/index.model';
import { routes } from './routes/index.routes';

class App {
  public app: express.Application;
  public port: string | number;
  public env: boolean;

  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.env = process.env.NODE_ENV === 'production' ? true : false;

    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on port ${this.port} ${process.env.NODE_ENV}`);
    });
  }

  public getServer() {
    return this.app;
  }

  private initializeMiddlewares() {
    if (this.env) {
      this.app.use(hpp());
      this.app.use(helmet());
      this.app.use(logger('combined'));
      this.app.use(cors({ origin: process.env.DOMAIN, credentials: true }));
    } else {
      this.app.use(logger('dev'));
      this.app.use(cors({ origin: true, credentials: true }));
    }
    sequelize.sync({ force: false });
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private initializeRoutes() {
    this.app.use('/', routes());

    this.app.all('*', (req, res) => {
      return res.status(404).json({
        status: false,
        error: 'not_found',
        message: Errors.RESOURCE_NOT_FOUND,
        path: req.url,
        data: {}
      });
    });
  }

  private initializeErrorHandling() {
    this.app.use(handleErrors);
  }
}

export default App;
