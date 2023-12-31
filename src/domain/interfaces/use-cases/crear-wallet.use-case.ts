import { Identity } from 'fabric-network';

export interface CrearWalletUseCase {
	execute(userId: string): Promise<Identity | undefined>;
}