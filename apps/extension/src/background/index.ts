import browser from "webextension-polyfill";
import { ExtensionKVStore, IndexedDBKVStore } from "@anoma/storage";
import { init as initCrypto } from "@anoma/crypto/src/init";
import { init as initShared } from "@anoma/shared/src/init";
import { Sdk } from "@anoma/shared";

import {
  ExtensionRouter,
  ExtensionGuards,
  ContentScriptEnv,
  ExtensionMessenger,
} from "extension";
import { Ports, KVPrefix } from "router";
import { defaultChainId, chains } from "@anoma/chains";
import { ChainsService, init as initChains } from "./chains";
import { KeyRingService, init as initKeyRing } from "./keyring";

Promise.all([initCrypto(), initShared()]).then(() => {
  const messenger = new ExtensionMessenger();
  const store = new IndexedDBKVStore(KVPrefix.IndexedDB);
  const sdkStore = new IndexedDBKVStore(KVPrefix.SDK);
  const sdk = new Sdk("http://127.0.0.1:26657");
  const extensionStore = new ExtensionKVStore(KVPrefix.LocalStorage, {
    get: browser.storage.local.get,
    set: browser.storage.local.set,
  });
  const router = new ExtensionRouter(
    ContentScriptEnv.produceEnv,
    messenger,
    extensionStore
  );
  router.addGuard(ExtensionGuards.checkOriginIsValid);
  router.addGuard(ExtensionGuards.checkMessageIsInternal);

  const chainsService = new ChainsService(store, [chains[defaultChainId]]);
  const keyRingService = new KeyRingService(
    store,
    sdkStore,
    defaultChainId,
    sdk
  );

  // Initialize messages and handlers
  initChains(router, chainsService);
  initKeyRing(router, keyRingService);

  router.listen(Ports.Background);
});

// The following is an example of launching an approval screen from the background:
/*
const url = browser.runtime.getURL("popup.html");
console.log({ url });

browser.windows.create({
  url: `${url}?redirect=/tx`,
  width: 415,
  height: 510,
  type: "popup",
});
*/
