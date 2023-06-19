import { MsgRes } from "../../models";
import { FabricError } from "fabric-network";
import { SubmitError } from "@hyperledger/fabric-gateway";


export interface TerminarEleccionUseCase {
	execute(idEleccion: number): Promise<MsgRes | FabricError | SubmitError>;
}