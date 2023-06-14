import { Eleccion } from "../../models";

export interface VotacionesRepository {
	agregarEleccion(eleccion: Eleccion): Promise<void>;
	terminarEleccion(idEleccion: number): void;
	sufragar(idEleccion: number, lista: string, fecha: string): void;
}