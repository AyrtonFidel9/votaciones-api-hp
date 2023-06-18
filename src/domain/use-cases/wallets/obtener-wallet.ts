import { Identity } from "fabric-network";
import { ObtenerWalletUseCase } from "../../interfaces";
import { WalletsRepository } from "../../interfaces/repositories/wallets.repository";

export class ObtenerWallet implements ObtenerWalletUseCase {

	walletsRepository: WalletsRepository;

	constructor(_walletsRepository: WalletsRepository) {
		this.walletsRepository = _walletsRepository;
	}

	async execute(userId: string): Promise<Identity | undefined> {
		const res = await this.walletsRepository.getWallet(userId);
		return res;
	}
}