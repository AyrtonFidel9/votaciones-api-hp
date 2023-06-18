import { CrearWalletAdminUseCase } from '../../interfaces';
import { WalletsRepository } from '../../interfaces/repositories/wallets.repository';
import { Identity } from 'fabric-network';

export class CrearWalletAdmin implements CrearWalletAdminUseCase {

	walletsRepository: WalletsRepository;

	constructor(_walletsRepository: WalletsRepository) {
		this.walletsRepository = _walletsRepository;
	}

	async execute(adminId: string, passw: string): Promise<Identity | undefined> {
		const res = await this.walletsRepository.createAdmin(adminId, passw);
		return res;
	}
}