import {
  Button,
  ButtonVariant,
  Image,
  ImageName,
  LinkButton,
} from "@namada/components";
import { ColorMode, getTheme } from "@namada/utils";
import { AppContainerHeader, GlobalStyles, Logo } from "App/App.components";
import { useAtom } from "jotai";
import React, { useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { AirdropConfirmation } from "./AirdropConfirmation";
import { Claim } from "./Claim";
import { ClaimConfirmation } from "./Claim/ClaimConfirmation";
import { ClaimInfo } from "./Claim/ClaimInfo";
import { Main } from "./Main";
import { NonEligible } from "./NonEligible";
import { TrustedSetup } from "./TrustedSetup";
import { claimAtom, confirmationAtom, labelAtom } from "./state";

export const App: React.FC = () => {
  const initialColorMode = "light";
  const [colorMode, _] = useState<ColorMode>(initialColorMode);
  const [claimState, setClaimState] = useAtom(claimAtom);
  const [label] = useAtom(labelAtom);
  const [confirmationState, setConfirmationState] = useAtom(confirmationAtom);
  const theme = getTheme(colorMode);
  const navigate = useNavigate();
  const { pathname } = window.location;
  const showStartOver =
    pathname === "/non-eligible" || pathname === "/trusted-setup";
  const showLogout =
    pathname.includes("/claim") || pathname.includes("/airdrop-confirmed");

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles colorMode={colorMode} />
      <AppContainerHeader>
        <Button
          style={showStartOver ? {} : { display: "none" }}
          variant={ButtonVariant.Small}
          onClick={() => {
            navigate("/");
            setClaimState(null);
            setConfirmationState(null);
          }}
        >
          Start over
        </Button>
        <Logo>
          <Image
            imageName={ImageName.Logo}
            styleOverrides={{ width: "240px" }}
            forceLightMode={true}
          />
        </Logo>
        <LinkButton themeColor="utility2">Terms of service</LinkButton>
        <Button
          style={showLogout ? {} : { display: "none" }}
          variant={ButtonVariant.Small}
          onClick={() => {
            navigate("/");
            setClaimState(null);
            setConfirmationState(null);
          }}
        >
          {label?.value.substring(0, 8)} <b>{"↦"}</b>
        </Button>
      </AppContainerHeader>
      <Routes>
        <Route path={`/`} element={<Main />} />
        <Route
          path={`/claim`}
          element={
            !!claimState ? <Claim /> : <Navigate to="/" replace={true} />
          }
        >
          <Route path={`info`} element={<ClaimInfo />} />
          <Route path={`confirmation`} element={<ClaimConfirmation />} />
        </Route>
        <Route path={`/trusted-setup`} element={<TrustedSetup />} />
        <Route
          path={`/airdrop-confirmed`}
          element={
            !!confirmationState ? (
              <AirdropConfirmation />
            ) : (
              <Navigate to="/" replace={true} />
            )
          }
        />
        <Route path={`/non-eligible`} element={<NonEligible />} />
      </Routes>
    </ThemeProvider>
  );
};
