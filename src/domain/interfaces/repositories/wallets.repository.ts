import { Identity } from 'fabric-network';

export interface WalletsRepository {
	createWallet(userId: string): Promise<Identity | undefined>;
	getWallet(userId: string): Promise<Identity | undefined>;
	createAdmin(admin: string, passw: string): Promise<Identity | undefined>;
}