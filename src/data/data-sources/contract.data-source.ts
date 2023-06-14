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
	keyDirectoryPath: string;
	certPath: PathLike | FileHandle;
	tlsCertPath: PathLike | FileHandle;
	peerEndpoint: string;
	peerHostAlias?: string;
	//cryptoPath = path.resolve(__dirname, '..', '..', '..', '..', '..', 'fabric-samples', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com');


	constructor() {
		this.channelName = process.env.CHANNEL_NAME || '';
		this.chaincodeName = process.env.CHAINCODE_NAME || '';
		this.mspId = process.env.MSP_ID || '';

		this.tlsCertPath = path.resolve(__dirname, '..', '..', '..', process.env.TLS_CERT_PATH || '');
		this.keyDirectoryPath = path.resolve(__dirname, '..', '..', '..', process.env.KEY_DIRECTORY_PATH || '');

		this.peerEndpoint = process.env.PEER_ENDPOINT || '';
		this.peerHostAlias = process.env.PEER_HOST_ALIAS;
		this.certPath = path.resolve(__dirname, '..', '..', '..', process.env.CERT_PATH || '');
		//this.tlsCertPath = path.resolve(this.cryptoPath, 'peers', 'peer0.org1.example.com', 'tls', 'ca.crt');
		//this.keyDirectoryPath = path.resolve(this.cryptoPath, 'users', 'User1@org1.example.com', 'msp', 'keystore');
		//this.certPath = path.resolve(this.cryptoPath, 'users', 'User1@org1.example.com', 'msp', 'signcerts', 'User1@org1.example.com-cert.pem');
	}

	async connectContract(): Promise<Connection> {
		const client = await this.newGrpConnection();
		const gateway = connect({
			client,
			identity: await this.newIdentity(),
			signer: await this.newSigner(),

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

	async newIdentity(): Promise<Identity> {
		const credentials = await fs.readFile(this.certPath);
		return { mspId: this.mspId, credentials };
	}

	async newSigner(): Promise<Signer> {
		const files = await fs.readdir(this.keyDirectoryPath);
		const keyPath = path.resolve(this.keyDirectoryPath, files[0]);
		const privateKeyPem = await fs.readFile(keyPath);
		const privateKey = crypto.createPrivateKey(privateKeyPem);
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