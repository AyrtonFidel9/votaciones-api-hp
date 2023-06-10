import { TerminarEleccionUseCase, VotacionesRepository } from "../../interfaces";

export class TerminarEleccion implements TerminarEleccionUseCase {

	votacionesRepository: VotacionesRepository;

	constructor(_votacionesRepo: VotacionesRepository) {
		this.votacionesRepository = _votacionesRepo;
	}

	execute(idEleccion: number): void {

	}
}