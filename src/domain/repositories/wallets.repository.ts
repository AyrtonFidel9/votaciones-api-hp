import { WalletsRepository } from '../interfaces/repositories/wallets.repository';
import { Wallet, Wallets } from 'fabric-network';
import * as path from 'path';
import { WalletDataSource } from '../../data/data-sources/wallet.data-source';
import * as dotenv from 'dotenv';

dotenv.config();

export class WalletsRepositoryImpl implements WalletsRepository {
	walletPath = path.join(__dirname, 'wallet');

	walletDataSource: WalletDataSource;

	constructor(_walletDS: WalletDataSource) {
		this.walletDataSource = _walletDS;
	}

	async createWallet(userId: string): Promise<Wallet> {

		const cpp = this.walletDataSource.buildCCPOrg();

		const caClient = this.walletDataSource.buildCAClient(
			cpp,
			process.env.CA_HOSTNAME || ''
		);

		const wallet = await this.walletDataSource.buildWallet();

		const msp: string = process.env.MSP_ID || '';
		const admin: string = process.env.ADMIN || '';

		await this.walletDataSource.registerAndEnrollUser(
			caClient,
			wallet,
			msp,
			userId,
			process.env.AFFILIATION || '',
			admin
		);

		console.log("--------------------------------------------->>>>>>>>>>>>>>");
		console.log(wallet.get(userId));
		return wallet;
	}

	async getWallet(): Promise<Wallet> {
		let wallet: Wallet;
		wallet = await Wallets.newFileSystemWallet(this.walletPath);
		return wallet;
	}

	async createAdmin(): Promise<Wallet> {
		/* await this.walletDataSource.enrollAdmin(
			caClient,
			wallet,
			msp,
			admin,
			"1234",
		); */

		let wallet: Wallet;
		wallet = await Wallets.newFileSystemWallet(this.walletPath);
		return wallet;
	}
}