import { CrearWalletUseCase } from '../../interfaces';
import { WalletsRepository } from '../../interfaces/repositories/wallets.repository';
import { Identity } from 'fabric-network';

export class CrearWallet implements CrearWalletUseCase {

	walletsRepository: WalletsRepository;

	constructor(_walletsRepository: WalletsRepository) {
		this.walletsRepository = _walletsRepository;
	}

	async execute(userId: string): Promise<Identity | undefined> {
		const res = await this.walletsRepository.createWallet(userId);
		return res;
	}
}