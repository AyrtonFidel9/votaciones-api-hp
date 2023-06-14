import express, { Request, Response } from 'express';
import { CrearWalletUseCase } from '../../domain/interfaces';

const routerWallets = (
	crearWallet: CrearWalletUseCase
) => {
	const router = express.Router();

	router.post('/', (req: Request, res: Response): void => {
		try {
			const { userId } = req.body;
			crearWallet.execute(userId);
			//res.send("Hola Mundo DAPP HYPERLEDGER");
		} catch {

		}
	});

	router.get('/', (req: Request, res: Response): void => {
		try {

			console.log(req.body);
		} catch {

		}
	});
	return router;
}




export { routerWallets };