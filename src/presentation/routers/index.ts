import express from 'express';
import { routerVotaciones } from './votaciones.router';
import { AgregarEleccion, Sufragar, TerminarEleccion } from '../../domain/use-cases/votaciones';
import { VotacionesRepositoryImpl } from '../../domain/repositories';
import { ContractDataSource } from '../../data/data-sources';
import { routerWallets } from './wallets.router';
import { CrearWallet, CrearWalletAdmin, ObtenerWallet } from '../../domain/use-cases';
import { WalletsRepositoryImpl } from '../../domain/repositories/wallets.repository';
import { WalletDataSource } from '../../data/data-sources/wallet.data-source';
import { TransferirToken } from '../../domain/use-cases/votaciones/transferir-token';

const routes = express.Router();

const contractDS = new ContractDataSource();
const walletDS = new WalletDataSource();

const votacionesMiddleware = routerVotaciones(
	new AgregarEleccion(new VotacionesRepositoryImpl(contractDS)),
	new TerminarEleccion(new VotacionesRepositoryImpl(contractDS)),
	new Sufragar(new VotacionesRepositoryImpl(contractDS)),
	new TransferirToken(new VotacionesRepositoryImpl(contractDS)),
);

const walletMiddleware = routerWallets(
	new CrearWallet(new WalletsRepositoryImpl(walletDS)),
	new CrearWalletAdmin(new WalletsRepositoryImpl(walletDS)),
	new ObtenerWallet(new WalletsRepositoryImpl(walletDS)),
);

routes.use('/eleccion', votacionesMiddleware);
routes.use('/wallet', walletMiddleware);


export { routes };