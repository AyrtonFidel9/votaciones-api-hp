import express, { Request, Response } from 'express';

const routerVotaciones = express.Router();

routerVotaciones.get('/', (req: Request, res: Response): void => {
	res.send("Hola Mundo DAPP HYPERLEDGER");
});

export { routerVotaciones };