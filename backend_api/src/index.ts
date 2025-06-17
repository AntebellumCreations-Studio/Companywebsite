import 'reflect-metadata';
import { container } from 'tsyringe';

import App from './app';
import { UserRoute } from './routes';
import { AuthRoute } from './routes';
import { PostRoute } from './routes';
import { GamePostRoute } from './routes';

const userRoute = container.resolve(UserRoute);
const authRoute = container.resolve(AuthRoute);
const postRoute = container.resolve(PostRoute);
const gamePostRoute = container.resolve(GamePostRoute);

let app = new App([userRoute, authRoute, postRoute,gamePostRoute]);

let server = app.listen();
let client = app.getServer();

export { server, client };
