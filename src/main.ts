import server from './server';
import dotenv from 'dotenv';
import { routes } from './presentation/routers';

dotenv.config();

console.log(process.env.PORT);
const port = process.env.PORT || 3001;

server.use(routes);

server.listen(process.env.PORT, () => {
	console.log(`App listening on PORT ${port}`);
});