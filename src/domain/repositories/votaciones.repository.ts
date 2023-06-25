import { ContractDataSource } from "../../data/data-sources";
import { VotacionesRepository } from "../interfaces";
import { Eleccion, MsgRes } from "../models";
import { Contract, Identity, SubmitError } from '@hyperledger/fabric-gateway';
import * as dotenv from 'dotenv';
import * as path from "path";
import { WalletDataSource } from "../../data/data-sources/wallet.data-source";

dotenv.config();


export class VotacionesRepositoryImpl implements VotacionesRepository {
	contractDS: ContractDataSource;
	walletDataSource: WalletDataSource;

	channelName: string;
	chaincodeName: string;
	certPath: string;
	keyDirectoryPath: string;

	constructor(_contractDS: ContractDataSource, _walletDS: WalletDataSource) {
		this.contractDS = _contractDS;
		this.channelName = process.env.CHANNEL_NAME || '';
		this.chaincodeName = process.env.CHAINCODE_NAME || '';
		this.walletDataSource = _walletDS;
		this.keyDirectoryPath = path.resolve(__dirname, '..', '..', '..', process.env.KEY_DIRECTORY_PATH || '');
		this.certPath = path.resolve(__dirname, '..', '..', '..', process.env.CERT_PATH || '');
	}

	async agregarEleccion(eleccion: Eleccion):
		Promise<MsgRes | SubmitError> {
		const connection = await this.contractDS.connectContract(
			this.certPath,
			this.keyDirectoryPath
		);
		const { contract, client, gateway } = connection;

		try {
			await contract.submitTransaction(
				"agregarEleccion",
				eleccion.idEleccion.toString(),
				eleccion.fecha,
			);

			client.close();
			gateway.close();

			return ({
				code: 200,
				msg: "Elección agregada con éxito"
			});

		} catch (err: unknown) {
			client.close();
			gateway.close();
			const error: SubmitError = err as SubmitError;
			throw error.details[0];
		}
	}

	async terminarEleccion(idEleccion: number):
		Promise<MsgRes | SubmitError> {
		const connection = await this.contractDS.connectContract(
			this.certPath,
			this.keyDirectoryPath
		);
		const { contract, client, gateway } = connection;

		try {
			await contract.submitTransaction(
				"terminarEleccion",
				idEleccion.toString(),
			);

			client.close();
			gateway.close();

			return ({
				code: 200,
				msg: "Elección terminada con éxito"
			});

		} catch (err: unknown) {
			client.close();
			gateway.close();
			const error: SubmitError = err as SubmitError;
			throw error.details[0];
		}
	}

	async sufragar(idEleccion: number, lista: string, fecha: string, socioID: string):
		Promise<MsgRes | SubmitError> {
		const cpp = this.walletDataSource.buildCCPOrg();

		const wallet = await this.walletDataSource.buildWallet();

		const walletSocio = await wallet.get(socioID);

		if (typeof walletSocio === 'undefined') {
			return ({
				code: 400,
				msg: 'El sufragante no existe o no esta registrado',
			});
		}

		const jsonWS = JSON.stringify(walletSocio);
		const identitySocio: Identity = JSON.parse(jsonWS);
		const signerSocio: Identity = JSON.parse(jsonWS);

		const connection = await this.contractDS.connectContract(
			identitySocio,
			signerSocio
		);

		const { contract, client, gateway } = connection;

		try {

			await contract.submitTransaction(
				"sufragar",
				idEleccion.toString(),
				lista,
				fecha
			);
			gateway.close();
			client.close();
			return ({
				code: 200,
				msg: 'Voto enviado con éxito',
			});
		} catch (err: unknown) {
			gateway.close();
			client.close();
			const error: SubmitError = err as SubmitError;
			throw error.details[0];
		}
	}

	async enviarToken(socioID: string): Promise<MsgRes | SubmitError> {
		const connection = await this.contractDS.connectContract(
			this.certPath,
			this.keyDirectoryPath
		);
		const { contract, client, gateway } = connection;

		try {

			const utf8Decoder = new TextDecoder();

			const bytesBalance = await contract.evaluateTransaction('BalanceOf', socioID);
			const jsonBalance = utf8Decoder.decode(bytesBalance);

			const tokens: number = Number.parseInt(jsonBalance);

			if (tokens >= 1) {
				return ({
					code: 200,
					msg: "El límite de tokens de votación es 1"
				});
			}

			const resP = await contract.submitTransaction(
				"Transfer",
				socioID,
				"1"
			);
			console.log(resP);

			client.close();
			gateway.close();

			return ({
				code: 200,
				msg: "Token fondeado con éxito"
			});

		} catch (err: unknown) {
			client.close();
			gateway.close();
			console.log(err);
			const error: SubmitError = err as SubmitError;
			throw error.details[0];
		}
	}

	async obtenerBalance(userId: string): Promise<number> {
		const connection = await this.contractDS.connectContract(
			this.certPath,
			this.keyDirectoryPath
		);
		const { contract, client, gateway } = connection;

		try {

			const utf8Decoder = new TextDecoder();
			//			await this.getInformationAboutSC(contract);
			const bytesBalance = await contract.evaluateTransaction('BalanceOf', userId);
			const jsonBalance = utf8Decoder.decode(bytesBalance);
			const tokens: number = Number.parseInt(jsonBalance);
			return tokens;

		} catch (err: unknown) {
			client.close();
			gateway.close();
			console.log(err);
			const error: SubmitError = err as SubmitError;
			throw error.details[0];
		}
	}

	async getInformationAboutSC(contract: Contract): Promise<void> {
		const utf8Decoder = new TextDecoder();

		console.log("Informacion-.-----------------------");
		const bytesTokenName = await contract.evaluateTransaction('TokenName');
		const jsonTokenName = utf8Decoder.decode(bytesTokenName);
		const tokenName = JSON.stringify(jsonTokenName);

		const bytesSymbol = await contract.evaluateTransaction('Symbol');
		const jsonSymbol = utf8Decoder.decode(bytesSymbol);
		const symbol = JSON.stringify(jsonSymbol);

		const bytesDecimals = await contract.evaluateTransaction('Decimals');
		const jsonDecimals = utf8Decoder.decode(bytesDecimals);
		const decimals = JSON.stringify(jsonDecimals);

		const bytesTotalSupply = await contract.evaluateTransaction('TotalSupply');
		const jsonTotalSupply = utf8Decoder.decode(bytesTotalSupply);
		const totalSupply = JSON.stringify(jsonTotalSupply);


		console.log(`TOKEN:     ${tokenName}`);
		console.log(`SIMBOLO:   ${symbol}`);
		console.log(`DECIMALES: ${decimals}`);
		console.log(`CANTIDAD:  ${totalSupply}`);
	}
}