import 'reflect-metadata';
import { container } from 'tsyringe';

import App from './app';
import { UserRoute } from './routes';
import { AuthRoute } from './routes';
import { PostRoute } from './routes';

const userRoute = container.resolve(UserRoute);
const authRoute = container.resolve(AuthRoute);
const postRoute = container.resolve(PostRoute);

let app = new App([userRoute, authRoute, postRoute]);

let server = app.listen();
let client = app.getServer();

export { server, client };
