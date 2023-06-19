import { FabricError } from "fabric-network";
import { MsgRes } from "../../models";
import { SubmitError } from "@hyperledger/fabric-gateway";

export interface SufragarUseCase {
	execute(
		idEleccion: number,
		lista: string,
		fecha: string,
		socioID: string
	): Promise<MsgRes | FabricError | SubmitError>;
}