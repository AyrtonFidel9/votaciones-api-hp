import { Wallet } from "fabric-network";

export interface WalletsRepository {
	createWallet(userId: string): Promise<Wallet>;
	getWallet(): Promise<Wallet>;
	createAdmin(): Promise<Wallet>;
}