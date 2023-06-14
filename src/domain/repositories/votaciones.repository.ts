import { ContractDataSource } from "../../data/data-sources";
import { VotacionesRepository } from "../interfaces";
import { Eleccion } from "../models";
import { Contract } from '@hyperledger/fabric-gateway';
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

	async agregarEleccion(eleccion: Eleccion): Promise<void> {
		const connection = await this.contractDS.connectContract();
		const { contract, client, gateway } = connection;

		console.log(eleccion);

		await this.getInformationAboutSC(contract);


		client.close();
		gateway.close();
	}

	terminarEleccion(idEleccion: number): void {

	}

	sufragar(idEleccion: number, lista: string, fecha: string): void {

	}

	async getInformationAboutSC(contract: Contract): Promise<void> {
		const utf8Decoder = new TextDecoder();

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