import { Eleccion } from "../../models";

export interface AgregarEleccionUseCase {
	execute(eleccion: Eleccion): void;
}