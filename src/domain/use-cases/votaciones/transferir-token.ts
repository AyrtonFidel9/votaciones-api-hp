import { FabricError } from "fabric-network";
import { TransferirTokenUseCase, VotacionesRepository } from "../../interfaces";
import { MsgRes } from "../../models";
import { SubmitError } from "@hyperledger/fabric-gateway";


export class TransferirToken implements TransferirTokenUseCase {

	votacionesRepository: VotacionesRepository;

	constructor(_votacionesRepo: VotacionesRepository) {
		this.votacionesRepository = _votacionesRepo;
	}

	async execute(socioID: string): Promise<MsgRes | FabricError | SubmitError> {
		return await this.votacionesRepository.enviarToken(socioID);
	}
}