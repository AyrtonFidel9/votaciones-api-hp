export interface SufragarUseCase {
	execute(idEleccion: number, lista: string, fecha: string): void;
}