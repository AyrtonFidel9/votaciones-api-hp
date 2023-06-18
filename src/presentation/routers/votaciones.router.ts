import express, { Request, Response } from 'express';
import { AgregarEleccionUseCase } from '../../domain/interfaces';
import { MsgRes } from '../../domain/models';

const routerVotaciones = (
	agregarEleccion: AgregarEleccionUseCase
) => {
	const router = express.Router();

	router.post('/agregar-eleccion', async (req: Request, res: Response):
		Promise<Response<any, Record<string, any>>> => {
		try {

			const resp = await agregarEleccion.execute({
				...req.body
			}) as MsgRes;

			return res.status(resp.code).send(resp.msg);
		} catch (ex) {
			return res.status(400).send({
				message: ex
			});
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