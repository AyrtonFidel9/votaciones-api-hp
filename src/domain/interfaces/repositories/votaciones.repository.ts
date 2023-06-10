import { Eleccion } from "../../models";

export interface VotacionesRepository {
	agregarEleccion(eleccion: Eleccion): void;
	terminarEleccion(idEleccion: number): void;
	sufragar(idEleccion: number, lista: string, fecha: string): void;
}