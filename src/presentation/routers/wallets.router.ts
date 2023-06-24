import express, { Request, Response } from 'express';
import { CrearWalletAdminUseCase, CrearWalletUseCase, ObtenerWalletUseCase } from '../../domain/interfaces';

const routerWallets = (
	crearWallet: CrearWalletUseCase,
	crearWalletAdmin: CrearWalletAdminUseCase,
	obtenerWallet: ObtenerWalletUseCase,
) => {
	const router = express.Router();

	router.post('/', async (req: Request, res: Response):
		Promise<Response<any, Record<string, any>>> => {
		try {
			const { userId } = req.body;
			const data = await crearWallet.execute(userId);
			return res.status(200).send(data);
		} catch (ex) {
			return res.status(400).send({
				message: "Ha ocurrido un error al ingresar la billetera",
				messageTwo: ex
			});
		}
	});

	router.post('/admin', async (req: Request, res: Response):
		Promise<Response<any, Record<string, any>>> => {
		try {
			const { adminId, passw } = req.body;
			const data = await crearWalletAdmin.execute(adminId, passw);
			return res.status(200).send(data);
		} catch {
			return res.status(400).send({
				message: "Ha ocurrido un error al ingresar la billetera"
			});
		}
	});

	router.get('/', async (req: Request, res: Response):
		Promise<Response<any, Record<string, any>>> => {
		try {
			const userId = req.query.userId as string;
			const data = await obtenerWallet.execute(userId);
			if (data)
				return res.status(200).send(data);
			else
				return res.status(400).send({
					message: "No existe una billetera para el usuario consultado"
				});
		} catch {
			return res.status(400).send({
				message: "Ha ocurrido un error al recuperar la billetera"
			});
		}
	});

	return router;
}


export { routerWallets };