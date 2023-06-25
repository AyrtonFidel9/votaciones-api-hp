import { ObtenerBalanceUseCase, VotacionesRepository } from "../../interfaces";


export class ObtenerBalance implements ObtenerBalanceUseCase {

	votacionesRepository: VotacionesRepository;

	constructor(_votacionesRepo: VotacionesRepository) {
		this.votacionesRepository = _votacionesRepo;
	}

	async execute(userId: string): Promise<number> {
		return await this.votacionesRepository.obtenerBalance(userId);
	}
}