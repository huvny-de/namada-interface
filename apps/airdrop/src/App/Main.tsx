import { Keplr, Window as KeplrWindow } from "@keplr-wallet/types";
import { type MetaMaskInpageProvider } from "@metamask/providers";
import {
  ActionButton,
  Heading,
  LinkButton,
  Stack,
  Text,
} from "@namada/components";
import { Expo, Quint, gsap } from "gsap";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  ButtonContainer,
  CallToActionStack,
  EligibilityPanel,
  GithubLoading,
  GlobalStyles,
  IconContainer,
  MainContainer,
  MainFooter,
  MainHeader,
  MainSection,
  MainSectionButton,
  MainTopSection,
  ObjectsContainer,
  PoolContainer,
  PoolTopLayerContainer,
  SmallWarning,
} from "./App.components";
import { CosmosButton } from "./Buttons/CosmosButton";
import { DownloadKeplr } from "./Buttons/DownloadKeplr";
import { DownloadMetamask } from "./Buttons/DownloadMetamask";
import { GithubButton } from "./Buttons/GithubButton";
import { MetamaskButton } from "./Buttons/MetamaskButton";
import { OsmosisButton } from "./Buttons/OsmosisButton";
import { StargazerButton } from "./Buttons/StargazerButton";
import { TrustedSetupButton } from "./Buttons/TrustedSetupButton";
import { AcceptTermsCheckbox } from "./Common/AcceptTermsCheckbox";
import { Modal } from "./Common/Modal";
import { PageFooter } from "./Common/PageFooter";
import { Countdown } from "./Countdown";
import { BallSVg } from "./Graphics/Ball";
import { Bars1Svg } from "./Graphics/Bars1";
import { Bars2Svg } from "./Graphics/Bars2";
import { EyeSvg } from "./Graphics/Eye";
import { HiveSvg } from "./Graphics/Hive";
import { PoolSvg } from "./Graphics/Pool";
import { PoolTopLayer } from "./Graphics/PoolTopLayer";
import { WireSvg } from "./Graphics/Wire";
import { ZeroOneSvg } from "./Graphics/ZeroOne";
import { iconsOnMouseMovement } from "./animations";
import { useGithubHandler } from "./hooks";
import { MetamaskWindow } from "./types";

export const Main: React.FC = () => {
  const url = window.location.href;
  const hasCode = url.includes("?code=");
  const [keplr, setKeplr] = useState<Keplr | undefined>();
  const [metamask, setMetamask] = useState<MetaMaskInpageProvider>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTOSAccepted, setIsTOSAccepted] = useState(false);
  const [isGithubFetching, setIsGithubFetching] = useState(hasCode);

  const githubHandler = useGithubHandler();
  const objectContainerRef = useRef<HTMLDivElement>(null);
  const mainSectionRef = useRef<HTMLDivElement>(null);
  const endDate = new Date("Dec 30, 2023 13:00:00");
  const isOngoing = new Date().getTime() <= endDate.getTime();

  useEffect(() => {
    const fetch = async (): Promise<void> => {
      const code = url.split("?code=")[1];
      await githubHandler(code);
      setIsGithubFetching(false);
    };

    if (hasCode) {
      fetch();
    }
  }, []);

  useLayoutEffect(() => {
    gsap.context(() => {
      const tl = gsap.timeline();

      tl.set(
        ["svg", ".main-title", ".warning", ".announcement", ".call-to-action"],
        { opacity: 0 }
      );

      tl.fromTo(
        ".main-title",
        { y: "+=90", opacity: 0, scale: 0.75 },
        { y: "-=15", opacity: 1, scale: 1, duration: 0.65, ease: Quint.easeOut }
      );

      tl.addLabel("titleDisplayed");
      tl.to(
        ".main-title",
        { y: "-=75", duration: 0.5, ease: Expo.easeOut },
        "titleDisplayed"
      );

      tl.to(
        [".call-to-action", ".warning", ".announcement", "svg"],
        {
          opacity: 1,
          duration: 0.75,
          ease: Expo.easeOut,
          stagger: 0.075,
        },
        "titleDisplayed"
      );

      tl.fromTo(
        ".objects-container i",
        {
          y: `+=${window.innerHeight}`,
        },
        {
          y: 0,
          stagger: 0.1,
          duration: 2,
          ease: Expo.easeOut,
          overwrite: true,
        },
        "titleDisplayed"
      );
    }, mainSectionRef);
  }, []);

  useLayoutEffect(() => {
    if (!objectContainerRef.current) return;
    iconsOnMouseMovement(objectContainerRef.current || []);
  }, []);

  return (
    <>
      <MainContainer blurred={isModalOpen}>
        <GlobalStyles colorMode="light" />
        <MainTopSection ref={mainSectionRef}>
          <MainSection>
            {isOngoing ? (
              <Stack gap={4}>
                <MainHeader className="main-title">
                  <Heading
                    themeColor="utility1"
                    uppercase
                    level={"h1"}
                    size={"7xl"}
                  >
                    No<span> Privacy</span>
                    <br />
                    Without
                    <br />
                    Public Goods
                  </Heading>
                </MainHeader>
                <CallToActionStack className="call-to-action">
                  <Stack gap={1}>
                    <Text themeColor="utility1" fontSize="xl">
                      TIME LEFT TO CLAIM:
                    </Text>
                    <Text themeColor="utility1" fontSize="2xl">
                      <Countdown endDate={new Date(endDate)} />
                    </Text>
                  </Stack>
                  <ButtonContainer>
                    <ActionButton
                      variant="secondary"
                      size="sm"
                      borderRadius="sm"
                      onClick={() => {
                        setIsModalOpen(true);
                        setKeplr((window as KeplrWindow)?.keplr);
                        setMetamask((window as MetamaskWindow)?.ethereum);
                      }}
                    >
                      Check NAM eligibility
                    </ActionButton>
                  </ButtonContainer>
                </CallToActionStack>
                <SmallWarning className="warning">
                  Please check you are claiming using the following URL:
                  <div>
                    <strong>https://rpgfdrop.namada.net</strong>
                  </div>
                </SmallWarning>
                <Stack gap={0.5} className="announcement">
                  <MainSectionButton></MainSectionButton>
                  <LinkButton themeColor="utility1">
                    <b>Read the annoucement</b>
                  </LinkButton>
                </Stack>
              </Stack>
            ) : (
              <Heading themeColor="utility1" level={"h1"} size={"6xl"}>
                RPGF Drop
                <br /> claiming is now
                <br /> closed
              </Heading>
            )}
          </MainSection>
          <PoolContainer>
            <PoolSvg />
          </PoolContainer>
          <PoolTopLayerContainer>
            <PoolTopLayer />
          </PoolTopLayerContainer>
          <ObjectsContainer
            className="objects-container"
            ref={objectContainerRef}
          >
            <IconContainer left={-310} top={50}>
              <BallSVg />
            </IconContainer>
            <IconContainer left={255} top={40}>
              <HiveSvg />
            </IconContainer>
            <IconContainer left={-425} top={156}>
              <WireSvg />
            </IconContainer>
            <IconContainer left={380} top={150}>
              <Bars2Svg />
            </IconContainer>
            <IconContainer left={-540} top={380}>
              <Bars1Svg />
            </IconContainer>
            <IconContainer left={350} top={306}>
              <ZeroOneSvg />
            </IconContainer>
            <IconContainer left={305} top={377}>
              <EyeSvg />
            </IconContainer>
          </ObjectsContainer>
        </MainTopSection>
        <MainFooter>
          <Stack gap={6}>
            <Heading
              themeColor="utility1"
              size={"3xl"}
              level="h2"
              fontWeight="400"
            >
              Namada RPGF Drop
            </Heading>
            <Text themeColor="utility1" fontWeight="400">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
              semper tempor ante eu ullamcorper. Morbi fringilla gravida mi in
              cursus. Donec libero velit, vulputate vel nunc sed, pretium
              rhoncus quam.
            </Text>
            <Text themeColor="utility1" fontWeight="400">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
              semper tempor ante eu ullamcorper. Morbi fringilla gravida mi in
              cursus. Donec libero velit, vulputate vel nunc sed, pretium
              rhoncus quam.
            </Text>
          </Stack>
        </MainFooter>
        <PageFooter />
      </MainContainer>
      <Modal
        isOpen={isModalOpen}
        title="Check eligibility with:"
        onClose={() => setIsModalOpen(false)}
      >
        <EligibilityPanel>
          <Stack gap={6}>
            <Stack gap={3}>
              <GithubButton disabled={!isTOSAccepted} />
              <MetamaskButton disabled={!isTOSAccepted} />
              <TrustedSetupButton disabled={!isTOSAccepted} />
              {keplr && (
                <>
                  <CosmosButton disabled={!isTOSAccepted} />
                  <OsmosisButton disabled={!isTOSAccepted} />
                  <StargazerButton disabled={!isTOSAccepted} />
                </>
              )}
              {!metamask && <DownloadMetamask disabled={!isTOSAccepted} />}
              {!keplr && <DownloadKeplr disabled={!isTOSAccepted} />}
            </Stack>
            <AcceptTermsCheckbox
              checked={isTOSAccepted}
              onChange={() => setIsTOSAccepted(!isTOSAccepted)}
            />
          </Stack>
        </EligibilityPanel>
      </Modal>
      <GithubLoading
        visible={isGithubFetching}
        variant="full"
        status={"Please wait, we are checking the GitHub claim"}
        imageUrl="/images/loading.gif"
      />
    </>
  );
};
