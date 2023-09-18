import BigNumber from "bignumber.js";
import { SignatureType } from "@namada/ledger-namada"

export type SubmitBondProps = {
  validator: string;
  amount: BigNumber;
  source: string;
  nativeToken: string;
  tx: TxProps;
};

export type SubmitUnbondProps = {
  validator: string;
  amount: BigNumber;
  source: string;
  tx: TxProps;
};

export type SubmitWithdrawProps = {
  validator: string;
  source: string;
  tx: TxProps;
};

export type TxProps = {
  token: string;
  feeAmount: BigNumber;
  gasLimit: BigNumber;
  chainId: string;
  publicKey?: string;
  signer?: string;
};

export type RevealPKProps = {
  publicKey: string;
  tx: TxProps;
};

export type TransferProps = {
  tx: TxProps;
  source: string;
  target: string;
  token: string;
  amount: BigNumber;
  nativeToken: string;
};

export type IbcTransferProps = {
  tx: TxProps;
  source: string;
  receiver: string;
  token: string;
  amount: BigNumber;
  portId: string;
  channelId: string;
  timeoutHeight?: bigint;
  timeoutSecOffset?: bigint;
};

export type BridgeTransferProps = {
  nut: boolean;
  tx: TxProps;
  asset: string;
  recipient: string;
  sender: string;
  amount: BigNumber;
  feeAmount: BigNumber;
  feePayer?: string;
  feeToken: string;
};

export type SignatureProps = {
  secIndices: Uint8Array;
  singlesig?: Uint8Array;
  sigType: SignatureType;
  multisigIndices: Uint8Array;
  multisig: Uint8Array[];
};
