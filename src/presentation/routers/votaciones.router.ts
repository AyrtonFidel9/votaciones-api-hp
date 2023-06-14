import express, { Request, Response } from 'express';
import { AgregarEleccionUseCase } from '../../domain/interfaces';

const routerVotaciones = (
	agregarEleccion: AgregarEleccionUseCase
) => {
	const router = express.Router();

	router.post('/', (req: Request, res: Response): void => {
		try {

			console.log("POST LLAMADO");
			console.log(req.body);

			agregarEleccion.execute({
				idEleccion: 1,
				fecha: "dsad",
				finished: false,
				votosReceived: []
			});
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




export { routerVotaciones };