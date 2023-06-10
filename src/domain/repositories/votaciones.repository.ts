import { ContractDataSource } from "../../data/data-sources";
import { VotacionesRepository } from "../interfaces";
import { Eleccion } from "../models";

export class VotacionesRepositoryImpl implements VotacionesRepository {
	contracDS: ContractDataSource;

	constructor(_contractDS: ContractDataSource) {
		this.contracDS = _contractDS;
	}

	agregarEleccion(eleccion: Eleccion): void {

	}

	terminarEleccion(idEleccion: number): void {

	}

	sufragar(idEleccion: number, lista: string, fecha: string): void {

	}
}