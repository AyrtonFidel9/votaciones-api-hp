import { Identity } from 'fabric-network';

export interface CrearWalletAdminUseCase {
	execute(adminId: string, passw: string): Promise<Identity | undefined>;
}