import { FabricError } from "fabric-network";
import { Eleccion, MsgRes } from "../../models";
import { SubmitError } from "@hyperledger/fabric-gateway";

export interface AgregarEleccionUseCase {
	execute(eleccion: Eleccion): Promise<MsgRes | FabricError | SubmitError>;
}