import { FabricError } from "fabric-network";
import { Eleccion, MsgRes } from "../../models";
import { SubmitError } from "@hyperledger/fabric-gateway";

export interface VotacionesRepository {
	agregarEleccion(eleccion: Eleccion): Promise<MsgRes | FabricError | SubmitError>;
	terminarEleccion(idEleccion: number): void;
	sufragar(idEleccion: number, lista: string, fecha: string): void;
}