import { Sdk as SdkWasm, TxType } from "@namada/shared";
import {
  BondMsgValue,
  BondProps,
  EthBridgeTransferMsgValue,
  EthBridgeTransferProps,
  IbcTransferMsgValue,
  IbcTransferProps,
  Message,
  SignatureMsgValue,
  TransferMsgValue,
  TransferProps,
  TxMsgValue,
  TxProps,
  UnbondMsgValue,
  UnbondProps,
  VoteProposalMsgValue,
  VoteProposalProps,
  WithdrawMsgValue,
  WithdrawProps,
} from "@namada/types";
import { ResponseSign } from "@zondax/ledger-namada";
import { EncodedTx, SignedTx } from "./types";

/**
 * SDK functionality related to transactions
 */
export class Tx {
  /**
   * @param {SdkWasm} sdk - Instance of Sdk struct from wasm lib
   */
  constructor(protected readonly sdk: SdkWasm) {}

  /**
   * Build a transaction
   * @async
   * @param {TxType} txType - type of the transaction
   * @param {Uint8Array} encodedSpecificTx - encoded specific transaction
   * @param {Uint8Array} encodedTx - encoded transaction
   * @param {string} gasPayer - address of the gas payer
   * @returns {Promise<EncodedTx>} promise that resolves to an EncodedTx
   */
  async buildTxFromSerializedArgs(
    txType: TxType,
    encodedSpecificTx: Uint8Array,
    encodedTx: Uint8Array,
    gasPayer: string
  ): Promise<EncodedTx> {
    const tx = await this.sdk.build_tx(
      txType,
      encodedSpecificTx,
      encodedTx,
      gasPayer
    );

    return new EncodedTx(encodedTx, tx);
  }

  /**
   * Wrapper method to handle all supported Tx
   * @async
   * @param {TxType} txType - type of the transaction
   * @param {TxProps} txProps - transaction properties
   * @param {unknown} props - Props specific to type of Tx
   * @param {string} [gasPayer] - optional gas payer, defaults to source or sender
   * @returns {Promise<EncodedTx>} promise that resolves to an EncodedTx
   */
  async buildTx(
    txType: TxType,
    txProps: TxProps,
    props: unknown,
    gasPayer?: string
  ): Promise<EncodedTx> {
    switch (txType) {
      case TxType.Bond:
        return await this.buildBond(txProps, props as BondProps, gasPayer);
      case TxType.Unbond:
        return await this.buildUnbond(txProps, props as UnbondProps, gasPayer);
      case TxType.Withdraw:
        return await this.buildWithdraw(
          txProps,
          props as WithdrawProps,
          gasPayer
        );
      case TxType.RevealPK:
        const { publicKey } = txProps;
        if (!publicKey) {
          throw new Error("For RevealPK you must provide a public key!");
        }
        return await this.buildRevealPk(txProps, publicKey);
      case TxType.Transfer:
        return await this.buildTransfer(
          txProps,
          props as TransferProps,
          gasPayer
        );
      case TxType.IBCTransfer:
        return await this.buildIbcTransfer(
          txProps,
          props as IbcTransferProps,
          gasPayer
        );
      case TxType.VoteProposal:
        return await this.buildVoteProposal(
          txProps,
          props as VoteProposalProps,
          gasPayer
        );
      case TxType.EthBridgeTransfer:
        return await this.buildEthBridgeTransfer(
          txProps,
          props as EthBridgeTransferProps,
          gasPayer
        );
      default:
        throw new Error(`Unsupported Tx type: ${txType}`);
    }
  }

  /**
   * Build Transfer Tx
   * @async
   * @param {TxProps} txProps - properties of the transaction
   * @param {TransferProps} transferProps -  properties of the transfer
   * @param {string} [gasPayer] - optional gas payer, if not provided, defaults to transferProps.source
   * @returns {Promise<EncodedTx>} promise that resolves to an EncodedTx
   */
  async buildTransfer(
    txProps: TxProps,
    transferProps: TransferProps,
    gasPayer?: string
  ): Promise<EncodedTx> {
    const transferMsg = new Message<TransferMsgValue>();

    const encodedTx = this.encodeTxArgs(txProps);
    const encodedTransfer = transferMsg.encode(
      new TransferMsgValue(transferProps)
    );

    return await this.buildTxFromSerializedArgs(
      TxType.Transfer,
      encodedTransfer,
      encodedTx,
      gasPayer || transferProps.source
    );
  }

  /**
   * Build RevealPK Tx
   * @async
   * @param {TxProps} txProps - properties of the transaction
   * @param {string} publicKey - public key to reveal
   * @returns {Promise<EncodedTx>} promise that resolves to an EncodedTx
   */
  async buildRevealPk(txProps: TxProps, publicKey: string): Promise<EncodedTx> {
    const encodedTx = this.encodeTxArgs(txProps);

    return await this.buildTxFromSerializedArgs(
      TxType.RevealPK,
      new Uint8Array(),
      encodedTx,
      publicKey
    );
  }

  /**
   * Build Bond Tx
   * @async
   * @param {TxProps} txProps - properties of the transaction
   * @param {BondProps} bondProps -  properties of the bond tx
   * @param {string} [gasPayer] - optional gas payer, if not provided, defaults to bondProps.source
   * @returns {Promise<EncodedTx>} promise that resolves to an EncodedTx
   */
  async buildBond(
    txProps: TxProps,
    bondProps: BondProps,
    gasPayer?: string
  ): Promise<EncodedTx> {
    const bondMsg = new Message<BondMsgValue>();
    const encodedTx = this.encodeTxArgs(txProps);
    const encodedBond = bondMsg.encode(new BondMsgValue(bondProps));

    return await this.buildTxFromSerializedArgs(
      TxType.Bond,
      encodedBond,
      encodedTx,
      gasPayer || bondProps.source
    );
  }

  /**
   * Build Unbond Tx
   * @async
   * @param {TxProps} txProps - properties of the transaction
   * @param {UnbondProps} unbondProps - properties of the unbond tx
   * @param {string} [gasPayer] - optional gas payer, if not provided, defaults to unbondProps.source
   * @returns {Promise<EncodedTx>} promise that resolves to an EncodedTx
   */
  async buildUnbond(
    txProps: TxProps,
    unbondProps: UnbondProps,
    gasPayer?: string
  ): Promise<EncodedTx> {
    const bondMsg = new Message<UnbondMsgValue>();
    const encodedTx = this.encodeTxArgs(txProps);
    const encodedUnbond = bondMsg.encode(new UnbondMsgValue(unbondProps));

    return await this.buildTxFromSerializedArgs(
      TxType.Unbond,
      encodedUnbond,
      encodedTx,
      gasPayer || unbondProps.source
    );
  }

  /**
   * Build Withdraw Tx
   * @async
   * @param {TxProps} txProps - properties of the transaction
   * @param {WithdrawProps} withdrawProps - properties of the withdraw tx
   * @param {string} [gasPayer] - optional gas payer, if not provided, defaults to withdrawProps.source
   * @returns {Promise<EncodedTx>} promise that resolves to an EncodedTx
   */
  async buildWithdraw(
    txProps: TxProps,
    withdrawProps: WithdrawProps,
    gasPayer?: string
  ): Promise<EncodedTx> {
    const bondMsg = new Message<WithdrawProps>();
    const encodedTx = this.encodeTxArgs(txProps);
    const encodedWithdraw = bondMsg.encode(new WithdrawMsgValue(withdrawProps));

    return this.buildTxFromSerializedArgs(
      TxType.Withdraw,
      encodedWithdraw,
      encodedTx,
      gasPayer || withdrawProps.source
    );
  }

  /**
   * Build Ibc Transfer Tx
   * @async
   * @param {TxProps} txProps - properties of the transaction
   * @param {IbcTransferProps} ibcTransferProps - properties of the ibc transfer tx
   * @param {string} [gasPayer] - optional gas payer, if not provided, defaults to ibcTransferProps.source
   * @returns {Promise<EncodedTx>} promise that resolves to an EncodedTx
   */
  async buildIbcTransfer(
    txProps: TxProps,
    ibcTransferProps: IbcTransferProps,
    gasPayer?: string
  ): Promise<EncodedTx> {
    const ibcTransferMsg = new Message<IbcTransferProps>();
    const encodedTx = this.encodeTxArgs(txProps);
    const encodedIbcTransfer = ibcTransferMsg.encode(
      new IbcTransferMsgValue(ibcTransferProps)
    );

    return this.buildTxFromSerializedArgs(
      TxType.IBCTransfer,
      encodedIbcTransfer,
      encodedTx,
      gasPayer || ibcTransferProps.source
    );
  }

  /**
   * Build Ethereum Bridge Transfer Tx
   * @async
   * @param {TxProps} txProps - properties of the transaction
   * @param {EthBridgeTransferProps} ethBridgeTransferProps - properties of the eth bridge transfer tx
   * @param {string} [gasPayer] - optional gas payer, if not provided, defaults to ethBridgeTransferProps.sender
   * @returns {Promise<EncodedTx>} promise that resolves to an EncodedTx
   */
  async buildEthBridgeTransfer(
    txProps: TxProps,
    ethBridgeTransferProps: EthBridgeTransferProps,
    gasPayer?: string
  ): Promise<EncodedTx> {
    const ethBridgeTransferMsg = new Message<EthBridgeTransferProps>();
    const encodedTx = this.encodeTxArgs(txProps);
    const encodedEthBridgeTransfer = ethBridgeTransferMsg.encode(
      new EthBridgeTransferMsgValue(ethBridgeTransferProps)
    );

    return this.buildTxFromSerializedArgs(
      TxType.EthBridgeTransfer,
      encodedEthBridgeTransfer,
      encodedTx,
      gasPayer || ethBridgeTransferProps.sender
    );
  }

  /**
   * Built Vote Proposal Tx
   * @async
   * @param {TxProps} txProps - properties of the transaction
   * @param {VoteProposalProps} voteProposalProps - properties of the vote proposal tx
   * @param {string} [gasPayer] - optional gas payer, if not provided, defaults to voteProposalProps.signer
   * @returns {Promise<EncodedTx>} promise that resolves to an EncodedTx
   */
  async buildVoteProposal(
    txProps: TxProps,
    voteProposalProps: VoteProposalProps,
    gasPayer?: string
  ): Promise<EncodedTx> {
    const voteProposalMsg = new Message<VoteProposalProps>();
    const encodedTx = this.encodeTxArgs(txProps);
    const encodedVoteProposal = voteProposalMsg.encode(
      new VoteProposalMsgValue(voteProposalProps)
    );

    return this.buildTxFromSerializedArgs(
      TxType.VoteProposal,
      encodedVoteProposal,
      encodedTx,
      gasPayer || voteProposalProps.signer
    );
  }

  /**
   * Sign transaction
   * @async
   * @param {EncodedTx} encodedTx - encoded transaction
   * @param {string} [signingKey] - optional in the case of shielded tx
   * @returns {Promise<SignedTx>} promise that resolves to a SignedTx
   */
  async signTx(encodedTx: EncodedTx, signingKey?: string): Promise<SignedTx> {
    const { tx, txMsg } = encodedTx;
    const signedTx = await this.sdk.sign_tx(tx, txMsg, signingKey);

    // Free up resources allocated by EncodedTx
    encodedTx.free();

    return new SignedTx(txMsg, signedTx);
  }

  /**
   * Reveal Public Key using serialized Tx
   * @async
   * @param {string} signingKey - signing key
   * @param {TxProps} txProps - properties of the transaction
   * @returns {Promise<void>}
   */
  async revealPk(signingKey: string, txProps: TxProps): Promise<void> {
    const encodedTx = this.encodeTxArgs(txProps);
    return await this.sdk.reveal_pk(signingKey, encodedTx);
  }

  /**
   * Append signature for transactions signed by Ledger Hardware Wallet
   * @param {Uint8Array} txBytes - Serialized transaction
   * @param {ResponseSign} ledgerSignatureResponse - Serialized signature as returned from Ledger
   * @returns {Uint8Array} - Serialized Tx bytes with signature appended
   */
  appendSignature(
    txBytes: Uint8Array,
    ledgerSignatureResponse: ResponseSign
  ): Uint8Array {
    const { signature } = ledgerSignatureResponse;
    if (!signature) {
      throw new Error("Signature was not returned from Ledger!");
    }

    const {
      pubkey,
      raw_indices,
      raw_signature,
      wrapper_indices,
      wrapper_signature,
    } = signature;

    // Construct props from ledgerSignature
    /* eslint-disable */
    const props = {
      pubkey: new Uint8Array((pubkey as any).data),
      rawIndices: new Uint8Array((raw_indices as any).data),
      rawSignature: new Uint8Array((raw_signature as any).data),
      wrapperIndices: new Uint8Array((wrapper_indices as any).data),
      wrapperSignature: new Uint8Array((wrapper_signature as any).data),
    };
    /* eslint-enable */

    // Serialize signature
    const value = new SignatureMsgValue(props);
    const msg = new Message<SignatureMsgValue>();
    const encodedSignature = msg.encode(value);

    return this.sdk.append_signature(txBytes, encodedSignature);
  }

  /**
   * Helper to encode Tx args given TxProps
   * @param {TxProps} txProps - properties of the transaction
   * @returns {Uint8Array} Serialized TxMsgValue
   */
  encodeTxArgs(txProps: TxProps): Uint8Array {
    const txMsgValue = new TxMsgValue(txProps);
    const msg = new Message<TxMsgValue>();
    return msg.encode(txMsgValue);
  }
}
