import { Contract, Identity, Signer, connect, signers } from "@hyperledger/fabric-gateway";
import * as path from "path";
import * as dotenv from 'dotenv';
import * as grpc from '@grpc/grpc-js';
import { PathLike, promises as fs } from "fs";
import { FileHandle } from "fs/promises";
import * as crypto from 'crypto';
import { Connection, ContractInterface } from "../interfaces";

dotenv.config();

export class ContractDataSource implements ContractInterface {

	channelName: string;
	chaincodeName: string;
	mspId: string;
	tlsCertPath: PathLike | FileHandle;
	peerEndpoint: string;
	peerHostAlias?: string;

	constructor() {
		this.channelName = process.env.CHANNEL_NAME || '';
		this.chaincodeName = process.env.CHAINCODE_NAME || '';
		this.mspId = process.env.MSP_ID || '';

		this.tlsCertPath = path.resolve(__dirname, '..', '..', '..', process.env.TLS_CERT_PATH || '');

		this.peerEndpoint = process.env.PEER_ENDPOINT || '';
		this.peerHostAlias = process.env.PEER_HOST_ALIAS;

	}

	async connectContract(credentials: Identity | string, privateKey: Identity | string): Promise<Connection> {
		const client = await this.newGrpConnection();
		console.log(await this.newIdentity(credentials));
		console.log(await this.newSigner(privateKey));
		const gateway = connect({
			client,
			identity: await this.newIdentity(credentials),
			signer: await this.newSigner(privateKey),

			evaluateOptions: () => {
				return { deadline: Date.now() + 5000 }; // 5 seconds
			},
			endorseOptions: () => {
				return { deadline: Date.now() + 15000 }; // 15 seconds
			},
			submitOptions: () => {
				return { deadline: Date.now() + 5000 }; // 5 seconds
			},
			commitStatusOptions: () => {
				return { deadline: Date.now() + 60000 }; // 1 minute
			},
		});

		const network = gateway.getNetwork(this.channelName);
		const contract = network.getContract(this.chaincodeName);

		return { contract, client, gateway };
	}

	async newGrpConnection(): Promise<grpc.Client> {
		const tlsRootCert = await fs.readFile(this.tlsCertPath);
		const tlsCredentials = grpc.credentials.createSsl(tlsRootCert);
		return new grpc.Client(this.peerEndpoint, tlsCredentials, {
			'grpc.ssl_target_name_override': this.peerHostAlias,
		});
	}


	async newIdentity(_credentials: string | Identity): Promise<Identity> {
		let credentials: Buffer;
		if (typeof _credentials === 'string')
			credentials = await fs.readFile(_credentials);
		else if (typeof _credentials === 'undefined')
			throw "No se han proporcionado las credenciales"
		else {
			const certificate: string = JSON.parse(
				JSON.stringify(_credentials.credentials)
			).certificate;
			credentials = Buffer.from(certificate);
		}

		return { mspId: this.mspId, credentials };
	}

	async newSigner(_privateKeyPem: Identity | string): Promise<Signer> {

		let privateKey: crypto.KeyObject;

		if (typeof _privateKeyPem === 'string') {
			const files = await fs.readdir(_privateKeyPem);
			const keyPath = path.resolve(_privateKeyPem, files[0]);
			const privateKeyPem = await fs.readFile(keyPath);
			privateKey = crypto.createPrivateKey(privateKeyPem);
		} else {
			const pk: string = JSON.parse(
				JSON.stringify(_privateKeyPem.credentials)
			).privateKey;
			const buffer: Buffer = Buffer.from(pk);
			privateKey = crypto.createPrivateKey(buffer);
		}
		return signers.newPrivateKeySigner(privateKey);
	}

	async initLedger(contract: Contract): Promise<void> {
		await contract.submitTransaction(
			'Initialize',
			'Ballot Nueva Esperanza',
			'BNE',
			'0'
		);
	}
}