import PropTypes from "prop-types"
import styled from "styled-components"

export const KeyboardInput = ({ setAnswerInput, focusRef }) => {
  const KeyboardKeys = [
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
    <Keyboard>
      {KeyboardKeys.map((key) => (
        <KeyboardBtn
          key={key}
          onClick={() => handleKeyboardClick(key)}
        >
          {key}
        </KeyboardBtn>
      ))}
      <KeyboardBtn onClick={handleDeleteClick}>
        🗑️
      </KeyboardBtn>
    </Keyboard>
  )
}

const Keyboard = styled.div`
  display: grid;
  grid-template-rows: repeat(6, 1fr);
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
  max-width: 300px;
  margin: 10px auto;

  @media (min-width: 700px) {
    grid-template-rows: repeat(4, 1fr);
    grid-template-columns: repeat(10, 1fr);
    max-width: 680px;
  }
`

const KeyboardBtn = styled.button`
  width: 50px;
  border-radius: 10px;
  border: none;
  background-color: var(--sunset);
  color: white;
  text-shadow: 1px 1px 2px black;
  padding: 10px;
  font-size: 18px;
  cursor: pointer;
  box-shadow: 3px 3px var(--sunsetshadow);

  @media (min-width: 700px) {
    width: 60px;
    padding: 10px 20px;
  }

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
