import styled from "styled-components/macro";

const Button = styled.button`
  padding: 0.75em 1.25em;
  margin: 0.5em 1.25em;
  font-size: 1em;
  border-style: solid;
  text-align: center;
  font-weight: 500;
  font-family: "Space Grotesk", sans-serif;
  cursor: pointer;
`;

const RoundButton = styled(Button)`
  border-radius: 200px;
  border: none;
`;

export const OutlinedButton = styled(RoundButton)`
  border-color: ${(props) => props.theme.colors.primary.main60};
  background-color: ${(props) => props.theme.colors.utility1.main80};
  color: ${(props) => props.theme.colors.utility1.main80};

  &:hover {
    border-color: ${(props) => props.theme.colors.primary.main80};
  }
  &:disabled {
    opacity: 30%;
    cursor: initial;
    border-color: ${(props) => props.theme.colors.primary.main80};
  }

  &.active {
    background-color: ${(props) => props.theme.colors.primary.main};
    color: ${(props) => props.theme.colors.utility2.main80};
  }
`;

export const ContainedButton = styled(RoundButton)`
  background-color: ${(props) => props.theme.colors.primary.main};
  color: ${(props) => props.theme.colors.utility1.main80};
  &:disabled {
    opacity: 30%;
    cursor: initial;
  }
`;

export const ContainedAltButton = styled(RoundButton)`
  border-color: ${(props) => props.theme.colors.primary.main60};
  background-color: ${(props) => props.theme.colors.primary.main80};
  color: ${(props) => props.theme.colors.utility1.main80};
  &:hover {
    border-color: ${(props) => props.theme.colors.primary.main60};
  }
  &:disabled {
    opacity: 30%;
    cursor: initial;
    border-color: ${(props) => props.theme.colors.primary.main60};
  }
`;

export const SmallButton = styled(Button)`
  border-width: 1px;
  border-radius: 4px;
  background-color: transparent;
  border-color: ${(props) => props.theme.colors.primary.main60};
  color: ${(props) => props.theme.colors.utility2.main60};
  &:active {
    background-color: ${(props) => props.theme.colors.primary.main60};
    color: white;
  }
  &:disabled {
    opacity: 30%;
    cursor: initial;
    background-color: transparent;
  }
`;
