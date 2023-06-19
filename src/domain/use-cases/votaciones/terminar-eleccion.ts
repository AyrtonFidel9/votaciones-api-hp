import { TerminarEleccionUseCase, VotacionesRepository } from "../../interfaces";
import { MsgRes } from "../../models";
import { FabricError } from "fabric-network";
import { SubmitError } from "@hyperledger/fabric-gateway";

export class TerminarEleccion implements TerminarEleccionUseCase {

	votacionesRepository: VotacionesRepository;

	constructor(_votacionesRepo: VotacionesRepository) {
		this.votacionesRepository = _votacionesRepo;
	}

	async execute(idEleccion: number): Promise<MsgRes | FabricError | SubmitError> {
		return await this.votacionesRepository.terminarEleccion(idEleccion);
	}
}