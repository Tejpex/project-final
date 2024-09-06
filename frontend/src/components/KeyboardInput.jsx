import PropTypes from "prop-types"
import styled, { css } from "styled-components"

export const KeyboardInput = ({ setAnswerInput, focusRef }) => {
  const numPadNumbers = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "å",
    "ä",
    "ö",
  ]

  //Puts users click on keyboard-buttons into the inputfield
  const handleKeyboardClick = (key) => {
    setAnswerInput((prev) => prev + key.toString())
    if (focusRef.current) {
      focusRef.current.focus()
    }
  }

  const handleDeleteClick = () => {
    setAnswerInput("")
    if (focusRef.current) {
      focusRef.current.focus()
    }
  }

  return (
    <NumPad>
      {numPadNumbers.map((number) => (
        <NumPadBtn
          key={number}
          className="small"
          onClick={() => handleKeyboardClick(number)}
        >
          {number}
        </NumPadBtn>
      ))}
      <NumPadBtn className="delete" onClick={handleDeleteClick}>
        🗑️
      </NumPadBtn>
    </NumPad>
  )
}

const NumPad = styled.div`
  display: grid;
  grid-template-rows: repeat(4, 1fr);
  grid-template-columns: repeat(10, 1fr);
  gap: 10px;
  max-width: 700px;
  margin: 10px auto;
`

const NumPadBtn = styled.button`
  ${(props) =>
    props.className === "small" &&
    css`
      grid-column: span 1;
      grid-row: span 1;
      width: 60px;
    `}

  ${(props) =>
    props.className === "delete" &&
    css`
      grid-column: 10;
      grid-row: 3;
      width: 60px;
    `}

  border-radius: 10px;
  border: none;
  background-color: var(--sunset);
  color: white;
  text-shadow: 1px 1px 2px black;
  padding: 10px 20px;
  font-size: 18px;
  cursor: pointer;
  box-shadow: 3px 3px var(--sunsetshadow); //

  &:hover {
    background-color: var(--sunsethover);
    box-shadow: 4px 4px var(--sunsetshadow);
    transition: 0.2s ease;
  }
`

KeyboardInput.propTypes = {
  setAnswerInput: PropTypes.any,
  focusRef: PropTypes.any,
}
