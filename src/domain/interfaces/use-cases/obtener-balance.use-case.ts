
export interface ObtenerBalanceUseCase {
	execute(userId: string): Promise<number>;
}