import { CrearWalletUseCase } from '../../interfaces/use-cases/crear-wallet.use-case';
import { WalletsRepository } from '../../interfaces/repositories/wallets.repository';
import { Console } from 'console';

export class CrearWallet implements CrearWalletUseCase {

	walletsRepository: WalletsRepository;

	constructor(_walletsRepository: WalletsRepository) {
		this.walletsRepository = _walletsRepository;
	}

	async execute(userId: string): Promise<void> {
		const res = await this.walletsRepository.createWallet(userId);
		console.log(res);
	}
}