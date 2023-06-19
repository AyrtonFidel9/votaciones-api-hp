import { FabricError } from "fabric-network";
import { ContractDataSource } from "../../data/data-sources";
import { VotacionesRepository } from "../interfaces";
import { Eleccion, MsgRes } from "../models";
import { Contract, Gateway, SubmitError } from '@hyperledger/fabric-gateway';
import * as dotenv from 'dotenv';
dotenv.config();


export class VotacionesRepositoryImpl implements VotacionesRepository {
	contractDS: ContractDataSource;

	channelName: string;
	chaincodeName: string;

	constructor(_contractDS: ContractDataSource) {
		this.contractDS = _contractDS;
		this.channelName = process.env.CHANNEL_NAME || '';
		this.chaincodeName = process.env.CHAINCODE_NAME || '';
	}

	async agregarEleccion(eleccion: Eleccion):
		Promise<MsgRes | FabricError | SubmitError> {
		const connection = await this.contractDS.connectContract();
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
		Promise<MsgRes | FabricError | SubmitError> {
		const connection = await this.contractDS.connectContract();
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

	async sufragar(idEleccion: number, lista: string, fecha: string):
		Promise<MsgRes | FabricError | SubmitError> {

		return ({
			code: 200,
			msg: 'dsa',
		});
	}

	async enviarToken(socioID: string): Promise<MsgRes | FabricError | SubmitError> {
		const connection = await this.contractDS.connectContract();
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

			await contract.submitTransaction(
				"Transfer",
				socioID,
				"1"
			);

			/* await contract.submitTransaction(
				"Mint",
				"12000"
			); */

			client.close();
			gateway.close();

			return ({
				code: 200,
				msg: "Token fondeado con éxito"
			});

		} catch (err: unknown) {
			client.close();
			gateway.close();
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