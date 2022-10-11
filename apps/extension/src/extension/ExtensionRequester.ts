import browser from "webextension-polyfill";
import { getAnomaRouterId } from "../extension/utils";
import { Message } from "../router";

export class ExtensionRequester {
  async sendMessage<M extends Message<unknown>>(
    port: string,
    msg: M
  ): Promise<M extends Message<infer R> ? R : never> {
    msg.validate();
    msg.origin = window.location.origin;
    msg.meta = {
      ...msg.meta,
      routerId: await getAnomaRouterId(),
    };

    const result = await browser.runtime.sendMessage({
      port,
      type: msg.type(),
      msg: msg,
    });

    if (!result) {
      throw new Error("Null result");
    }

    if (result.error) {
      throw new Error(result.error);
    }

    return result.return;
  }

  static async sendMessageToTab<M extends Message<unknown>>(
    tabId: number,
    port: string,
    msg: M
  ): Promise<M extends Message<infer R> ? R : never> {
    msg.validate();
    msg.origin = window.location.origin;
    msg.meta = {
      ...msg.meta,
      routerId: await getAnomaRouterId(),
    };

    const result = await browser.tabs.sendMessage(tabId, {
      port,
      type: msg.type(),
      msg: msg,
    });

    if (!result) {
      throw new Error("Null result");
    }

    if (result.error) {
      throw new Error(result.error);
    }

    return result.return;
  }

  public startSession(): void {
    console.log("Reconnect to session");
    const port = browser.runtime.connect({ name: "session-port" });
    port.postMessage({ msg: "Establishing port to background" });
    console.log({ port });

    port.onMessage.addListener((m) => {
      console.log(`Port established: ${m.msg}`);
    });
  }
}
