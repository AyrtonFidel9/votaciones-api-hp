import express, { Request, Response } from 'express';
import { AgregarEleccionUseCase, SufragarUseCase, TerminarEleccionUseCase, TransferirTokenUseCase } from '../../domain/interfaces';
import { MsgRes } from '../../domain/models';

const routerVotaciones = (
	agregarEleccion: AgregarEleccionUseCase,
	terminarEleccion: TerminarEleccionUseCase,
	sufragar: SufragarUseCase,
	transferirToken: TransferirTokenUseCase,

) => {
	const router = express.Router();

	router.post('/agregar-eleccion', async (req: Request, res: Response):
		Promise<Response<any, Record<string, any>>> => {
		try {

			const resp = await agregarEleccion.execute({
				...req.body
			}) as MsgRes;

			return res.status(resp.code).send({
				message: resp.msg
			});
		} catch (ex) {
			return res.status(400).send({
				message: ex
			});
		}
	});

	router.put('/terminar-eleccion', async (req: Request, res: Response):
		Promise<Response<any, Record<string, any>>> => {
		try {
			const { idEleccion } = req.body;
			const resp = await terminarEleccion.execute(idEleccion) as MsgRes;
			return res.status(resp.code).send({
				message: resp.msg
			});
		} catch (ex) {
			console.log(ex);
			return res.status(400).send({
				message: ex
			});
		}
	});

	router.post('/enviar-token', async (req: Request, res: Response):
		Promise<Response<any, Record<string, any>>> => {
		try {
			const { socioID } = req.body;

			const resp = await transferirToken.execute(socioID) as MsgRes;

			return res.status(resp.code).send({
				message: resp.msg
			});

		} catch (ex) {
			console.log(ex);
			return res.status(400).send({
				message: ex
			});
		}
	});

	return router;
}

export { routerVotaciones };