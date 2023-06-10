import { AgregarEleccionUseCase, VotacionesRepository } from "../../interfaces";
import { Eleccion } from "../../models";

export class AgregarEleccion implements AgregarEleccionUseCase {

	votacionesRepository: VotacionesRepository;

	constructor(_votacionesRepo: VotacionesRepository) {
		this.votacionesRepository = _votacionesRepo;
	}

	execute(eleccion: Eleccion): void {

	}
}