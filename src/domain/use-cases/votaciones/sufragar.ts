import { SufragarUseCase, VotacionesRepository } from "../../interfaces";

export class Sufragar implements SufragarUseCase {

	votacionesRepository: VotacionesRepository;

	constructor(_votacionesRepo: VotacionesRepository) {
		this.votacionesRepository = _votacionesRepo;
	}

	execute(idEleccion: number, lista: string, fecha: string): void {

	}
}