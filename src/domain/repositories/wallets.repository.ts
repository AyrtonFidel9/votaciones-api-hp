import { WalletsRepository } from '../interfaces/repositories/wallets.repository';
import { Identity } from 'fabric-network';
import * as path from 'path';
import { WalletDataSource } from '../../data/data-sources/wallet.data-source';
import * as dotenv from 'dotenv';


dotenv.config();

export class WalletsRepositoryImpl implements WalletsRepository {
	walletPath = path.join(__dirname, 'wallet');

	walletDataSource: WalletDataSource;

	msp: string;

	constructor(_walletDS: WalletDataSource) {
		this.walletDataSource = _walletDS;
		this.msp = process.env.MSP_ID || '';

	}

	async createWallet(userId: string): Promise<Identity | undefined> {

		const cpp = this.walletDataSource.buildCCPOrg();

		const caClient = this.walletDataSource.buildCAClient(
			cpp,
			process.env.CA_HOSTNAME || ''
		);

		const wallet = await this.walletDataSource.buildWallet();

		const admin: string = process.env.ADMIN || '';

		await this.walletDataSource.registerAndEnrollUser(
			caClient,
			wallet,
			this.msp,
			userId,
			process.env.AFFILIATION || '',
			admin
		);

		return wallet.get(userId);
	}

	async getWallet(userId: string): Promise<Identity | undefined> {
		const wallet = await this.walletDataSource.buildWallet();
		return wallet.get(userId);
	}

	async createAdmin(admin: string, passw: string): Promise<Identity | undefined> {

		const cpp = this.walletDataSource.buildCCPOrg();

		const caClient = this.walletDataSource.buildCAClient(
			cpp,
			process.env.CA_HOSTNAME || ''
		);

		const wallet = await this.walletDataSource.buildWallet();

		await this.walletDataSource.enrollAdmin(
			caClient,
			wallet,
			this.msp,
			admin,
			passw,
		);

		return wallet.get(admin);
	}
}