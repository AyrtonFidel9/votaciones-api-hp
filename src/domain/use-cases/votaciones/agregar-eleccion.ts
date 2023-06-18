import { FabricError } from "fabric-network";
import { AgregarEleccionUseCase, VotacionesRepository } from "../../interfaces";
import { Eleccion, MsgRes } from "../../models";
import { SubmitError } from "@hyperledger/fabric-gateway";

export class AgregarEleccion implements AgregarEleccionUseCase {

	votacionesRepository: VotacionesRepository;

	constructor(_votacionesRepo: VotacionesRepository) {
		this.votacionesRepository = _votacionesRepo;
	}

	async execute(eleccion: Eleccion): Promise<MsgRes | FabricError | SubmitError> {
		return await this.votacionesRepository.agregarEleccion(eleccion);
	}
}