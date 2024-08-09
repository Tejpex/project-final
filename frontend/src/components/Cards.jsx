import styled from "styled-components"

export const GameTypeButton = styled.button`
  background-color: ${(props) =>
    props.color === "sunset" ? "var(--sunset)" : "var(--forest)"};
  color: white;
  text-shadow: 1px 1px 2px black;
  font-size: 18px;
  width: 270px;
  height: 70px;
  margin: 10px auto;
  padding: 20px 0;
  border-radius: 15px;
  border: none;
  cursor: pointer;
  box-shadow: 4px 4px var(--sunsetshadow);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    background-color: var(--sunsethover);
    box-shadow: 6px 6px var(--sunsetshadow);
    transition: 0.2s ease;
  }

  &:disabled {
    cursor: default;
    border: none;

    &:hover {
      background-color: var(--sunset);
    }
  }

  @media (min-width: 700px) {
    width: 270px;
    height: 120px;
    padding: 30px 20px;
    gap: 20px;
  }
`
