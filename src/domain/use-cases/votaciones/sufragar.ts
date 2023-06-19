import { SufragarUseCase, VotacionesRepository } from "../../interfaces";
import { MsgRes } from "../../models";
import { FabricError } from "fabric-network";
import { SubmitError } from "@hyperledger/fabric-gateway";

export class Sufragar implements SufragarUseCase {

	votacionesRepository: VotacionesRepository;

	constructor(_votacionesRepo: VotacionesRepository) {
		this.votacionesRepository = _votacionesRepo;
	}

	async execute(idEleccion: number, lista: string, fecha: string, socioID: string):
		Promise<MsgRes | FabricError | SubmitError> {
		return await this.votacionesRepository.sufragar(idEleccion, lista, fecha, socioID);
	}
}