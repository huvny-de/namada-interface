import { useEffect, useState } from "react";
import { Button, ButtonVariant } from "@anoma/components";
import {
  AccountInformationViewContainer,
  AccountInformationViewUpperPartContainer,
  AccountInformationForm,
  DescriptionAndInputContainer,
  Header1,
  Header5,
  BodyText,
  InputContainer,
  ButtonContainer,
} from "./SeedPhraseConfirmation.components";
import { Input } from "../Password/Password.components";

type SeedPhraseConfirmationProps = {
  seedPhrase: string[];
  onConfirm: () => void;
};

const SeedPhraseConfirmation = (
  props: SeedPhraseConfirmationProps
): JSX.Element => {
  const { seedPhrase, onConfirm } = props;
  const seedPhraseLength = seedPhrase.length;
  const [verificationInput, setVerificationInput] = useState("");
  const [indexToConfirm, setIndexToConfirm] = useState(-1);

  useEffect(() => {
    setIndexToConfirm(Math.floor(Math.random() * seedPhraseLength));
  }, []);

  return (
    <AccountInformationViewContainer>
      {/* header */}
      <AccountInformationViewUpperPartContainer>
        <Header1>Verify Phrase</Header1>
      </AccountInformationViewUpperPartContainer>

      {/* form */}
      <AccountInformationForm>
        <DescriptionAndInputContainer>
          {/* description */}
          <BodyText> </BodyText>

          {/* seed verification */}
          <InputContainer>
            <Header5>Word #{indexToConfirm + 1}</Header5>
            <Input
              onChange={(event) => {
                setVerificationInput(event.target.value);
              }}
            />
          </InputContainer>
        </DescriptionAndInputContainer>

        <ButtonContainer>
          <Button
            onClick={() => {
              onConfirm();
            }}
            disabled={verificationInput !== seedPhrase[indexToConfirm]}
            variant={ButtonVariant.Contained}
          >
            Verify
          </Button>
        </ButtonContainer>
      </AccountInformationForm>
    </AccountInformationViewContainer>
  );
};

export default SeedPhraseConfirmation;