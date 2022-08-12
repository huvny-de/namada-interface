import styled from "styled-components/macro";

export const ThemedScrollbarContainer = styled.div`
  overflow-y: auto;

  /* Custom CSS Scrollbar for div containers*/
  /* NOTE - Firefox will only show max width on hover, otherwise is thin profile */
  /* TODO - Refactor this into a common function */
  scrollbar-width: 10px;
  scrollbar-color: ${(props) => props.theme.colors.primary.main + " red"};

  &::-webkit-scrollbar {
    height: 12px;
    width: 10px;
    background: transparent;
    box-shadow: none;
    -webkit-box-shadow: none;
  }

  &::-webkit-scrollbar-thumb {
    background: ${(props) => props.theme.colors.primary.main};
    border-radius: 1ex;
    -webkit-border-radius: 1ex;
    box-shadow: none;
    -webkit-box-shadow: none;
  }

  &::-webkit-scrollbar-corner {
    background: red;
  }
`;

export const DerivedAccountsContainer = styled(ThemedScrollbarContainer)`
  width: 100%;
  height: 100%;
  font-size: 14px;
  margin: 24px 0 36px;
`;

export const DerivedAccountsList = styled.ul`
  list-style: none;
  list-style-type: none;
  padding: 0;
  max-height: 400px; /* TODO: Remove this - set a max height on a main container */
`;

export const DerivedAccountContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
`;

export const DerivedAccountItem = styled.li`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  margin: 0;
  padding: 20px 0;
  border-bottom: 1px solid ${(props) => props.theme.colors.utility2.main20};

  button {
    margin-top: 0;
    margin-right: 0;
  }

  &:first-child {
    padding-top: 0;
  }
  &:last-child {
    border-bottom: none;
  }
`;

export const DerivedAccountInfo = styled.div`
  display: flex;
  justify-content: flex-start;
`;

export const DerivedAccountAlias = styled.div`
  font-size: 16px;
  font-weight: bold;
  display: flex;
  flex-direction: row;
  align-items: center;
  color: ${(props) => props.theme.colors.utility2.main80};
`;

export const DerivedAccountType = styled.div`
  font-size: 12px;
  color: ${(props) => props.theme.colors.utility2.main60};
`;

export const DerivedAccountBalance = styled.div`
  padding: 8px 0;
  font-weight: bold;
  margin-bottom: 0;
  width: 200px;
  color: ${(props) => props.theme.colors.utility2.main};

  @media screen and (max-width: 860px) {
    text-align: right;
    padding-right: 20px;
  }
`;

export const DerivedAccountAddress = styled.pre`
  flex: 1 0 60%;
  overflow-x: scroll;
  background: #ddd;
  padding: 8px;
  border: 4px solid #ddd;
  border-radius: 8px;

  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: 0;
`;

export const DerivedAccountStatus = styled.span`
  font-weight: normal;
  font-size: 12px;
  padding-left: 8px;
  color: ${(props) => props.theme.colors.primary.main60};
`;

export const NoTokens = styled.div`
  font-size: 14px;
  font-weight: bold;
  background-color: ${(props) => props.theme.colors.utility2.main};
`;

export const Status = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  justify-content: center;
  font-size: 12px;
  font-weight: normal;
  color: ${(props) => props.theme.colors.utility2.main};
`;

export const TokenIcon = styled.img`
  width: 36px;
  height: 36px;
  cursor: pointer;
  margin-right: 12px;
`;

export const ShieldedLabel = styled.div`
  font-size: 10px;
  display: flex;
  justify-content: center;
  width: 68px;
  padding: 0;
  background-color: ${(props) => props.theme.colors.secondary.main};
  color: ${(props) => props.theme.colors.utility1.main};
  border-radius: 12px;
`;

export const TransparentLabel = styled.div`
  color: ${(props) => props.theme.colors.utility2.main60};
  font-size: 10px;
  display: flex;
  justify-content: center;
  width: 68px;
  padding: 0;
  border-radius: 12px;
  border: 1px solid ${(props) => props.theme.colors.utility2.main20};
`;
