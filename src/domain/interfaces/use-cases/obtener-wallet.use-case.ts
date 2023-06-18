import { Identity } from 'fabric-network';

export interface ObtenerWalletUseCase {
	execute(userId: string): Promise<Identity | undefined>;
}