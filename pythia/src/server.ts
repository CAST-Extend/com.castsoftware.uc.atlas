import 'dotenv/config';
import App from './app';
import IndexRoute from './routes/index.route';
import IndexAPIRoute from './routes/indexApi.route';
import validateEnv from './utils/validateEnv';

validateEnv();

const app = new App([new IndexRoute(), new IndexAPIRoute()]);

app.listen();
