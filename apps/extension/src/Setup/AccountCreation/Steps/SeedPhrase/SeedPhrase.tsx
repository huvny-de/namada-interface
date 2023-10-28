import React, { useEffect, useState } from "react";

import { ActionButton, Heading, RadioGroup, Stack } from "@namada/components";
import { HeaderContainer } from "Setup/Setup.components";
import { SeedPhraseInstructions, SeedPhraseList } from "Setup/Common";
import { AccountDetails } from "Setup/types";
import { GenerateMnemonicMsg } from "background/keyring";
import { ExtensionRequester } from "extension";
import { Ports } from "router";
import {
  CopyToClipboard,
  ExportSeedPhraseButtonsContainer,
} from "./SeedPhrase.components";

type Props = {
  requester: ExtensionRequester;
  // go to next screen
  onConfirm: (seedPhraseAsArray: string[]) => void;
  // depending if first load this might or might not be available
  accountCreationDetails?: AccountDetails;
  // depending if first load this might or might not be available
  defaultSeedPhrase?: string[];
};

// saves the content to clipboard
const textToClipboard = (content: string): void => {
  navigator.clipboard.writeText(content);
};

const SeedPhrase: React.FC<Props> = (props) => {
  const { requester, onConfirm, defaultSeedPhrase } = props;

  const [seedPhrase, setSeedPhrase] = useState(defaultSeedPhrase || []);
  const [mnemonicLength, setMnemonicLength] = useState(12);
  const isSubmitButtonDisabled = seedPhrase.length === 0;

  useEffect(() => {
    // if a mnemonic was passed in we do not generate it again
    if (defaultSeedPhrase?.length && defaultSeedPhrase?.length > 0) return;

    const setPhrase = async (): Promise<void> => {
      const words = await requester.sendMessage<GenerateMnemonicMsg>(
        Ports.Background,
        new GenerateMnemonicMsg(mnemonicLength)
      );
      setSeedPhrase(words);
    };
    setPhrase();
  }, [mnemonicLength]);

  return (
    <>
      {/* header */}
      <HeaderContainer>
        <Heading level="h1" size="3xl">
          New Seed Phrase
        </Heading>
      </HeaderContainer>

      <Stack gap={6}>
        <RadioGroup
          id="mnemonicLength"
          groupLabel="Number of seeds"
          value={mnemonicLength.toString()}
          options={[
            { text: "12 words", value: "12" },
            { text: "24 words", value: "24" },
          ]}
          onChange={(value) => setMnemonicLength(Number(value))}
        />
        <SeedPhraseList words={seedPhrase} />
        <SeedPhraseInstructions />
      </Stack>

      <ActionButton
        disabled={isSubmitButtonDisabled}
        onClick={() => {
          onConfirm(seedPhrase);
        }}
      >
        Next
      </ActionButton>

      {/* copy seed phrase */}
      {process.env.NODE_ENV === "development" && (
        <ExportSeedPhraseButtonsContainer>
          <CopyToClipboard
            onClick={(e) => {
              e.preventDefault();
              textToClipboard(seedPhrase.join(" "));
            }}
            href="#"
          >
            Copy to clipboard (Dev Only)
          </CopyToClipboard>
        </ExportSeedPhraseButtonsContainer>
      )}
    </>
  );
};

export default SeedPhrase;
