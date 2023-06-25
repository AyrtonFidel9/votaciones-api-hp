import { FabricError } from "fabric-network";
import { Eleccion, MsgRes } from "../../models";
import { SubmitError } from "@hyperledger/fabric-gateway";

export interface VotacionesRepository {
	agregarEleccion(eleccion: Eleccion): Promise<MsgRes | FabricError | SubmitError>;
	terminarEleccion(idEleccion: number): Promise<MsgRes | FabricError | SubmitError>;
	sufragar(idEleccion: number, lista: string, fecha: string, socioID: string): Promise<MsgRes | FabricError | SubmitError>;
	enviarToken(socioID: string): Promise<MsgRes | FabricError | SubmitError>;
	obtenerBalance(userId: string): Promise<number>;
}