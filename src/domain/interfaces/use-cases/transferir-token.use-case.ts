import { FabricError } from "fabric-network";
import { MsgRes } from "../../models";
import { SubmitError } from "@hyperledger/fabric-gateway";

export interface TransferirTokenUseCase {
	execute(socioID: string): Promise<MsgRes | FabricError | SubmitError>;
}