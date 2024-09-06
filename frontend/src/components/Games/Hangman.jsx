//External imports for handling basic functionality
import { useState, useEffect } from "react"
import PropTypes from "prop-types"

//For handling UI
import styled from "styled-components"
import Lottie from "lottie-react"
import Right from "../../assets/Right.json"
import Wrong from "../../assets/Wrong.json"
import gubbe1 from "../../assets/hangman/gubbe1.svg"
import gubbe2 from "../../assets/hangman/gubbe2.svg"
import gubbe3 from "../../assets/hangman/gubbe3.svg"
import gubbe4 from "../../assets/hangman/gubbe4.svg"
import gubbe5 from "../../assets/hangman/gubbe5.svg"
import gubbe6 from "../../assets/hangman/gubbe6.svg"
import gubbe7 from "../../assets/hangman/gubbe7.svg"
import gubbe8 from "../../assets/hangman/gubbe8.svg"
import gubbe9 from "../../assets/hangman/gubbe9.svg"
import gubbe10 from "../../assets/hangman/gubbe10.svg"
import gubbe11 from "../../assets/hangman/gubbe11.svg"

//Internal imports
import { useLanguage } from "../../contexts/LanguageContext"
import { KeyboardInput } from "../KeyboardInput"

export const Hangman = ({ focusRef, type }) => {
  // Loads words, keeps track of score and handles connections to backend
  const {
    swedishGame,
    setSwedishGame,
    generateQuestion,
    rightAnswer,
    registerAnswer,
  } = useLanguage()
  const currentScore = swedishGame[Number(type)].score
  //const subcategory = mathGame[Number(type)].subcategory

  //Handles keypad
  const [answerInput, setAnswerInput] = useState("")

  //Handles animations and messages when word is done or lost
  const [message, setMessage] = useState("")
  const [rightLottie, setRightLottie] = useState(false)
  const [wrongLottie, setWrongLottie] = useState(false)

  //Handles guesses and lives during game
  const [lives, setLives] = useState(10)
  const pictures = [
    gubbe11,
    gubbe10,
    gubbe9,
    gubbe8,
    gubbe7,
    gubbe6,
    gubbe5,
    gubbe4,
    gubbe3,
    gubbe2,
    gubbe1,
  ]
  const [display, setDisplay] = useState("") //What is showing on screen
  const [displayAsArray, setDisplayAsArray] = useState([])
  const [guesses, setGuesses] = useState([])
  
  //Load page by setting a right word
  useEffect(() => {
    generateQuestion("swedish", Number(type))
    if (focusRef.current) {
      focusRef.current.focus()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  //When a right word is found make lines for it
  useEffect(() => {
    makeLines()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rightAnswer])

  //Go through each letter of right answer and make a line to display
  const makeLines = () => {
    let line = ""
    for (let x of rightAnswer) {
      line += "_ "
    }
    //Show the lines
    setDisplay(line)
    //Save lines in array to use later
    setDisplayAsArray (line.split(" "))
  }

  //Check user guess to see if it's incuded in right answer
  const checkGuess = async (event) => {
    event.preventDefault()
    const guess = answerInput.toLowerCase()
    if (rightAnswer.includes(guess)) {
      showLetters(guess)
    } else {
      setLives(lives - 1)
      const newGuessesArray = [...guesses, guess]
      setGuesses(newGuessesArray)
    }
    checkAnswer()
    setAnswerInput("")
    if (focusRef.current) {
      focusRef.current.focus()
    }
  }

  //If guess is right, show those letters on screen
  const showLetters = (guess) => {
    let index = 0
    while (index < displayAsArray.length) {
      if (guess === rightAnswer.charAt(index)) {
        displayAsArray[index] = guess
      }
      index++
    }
    const newDisplay = displayAsArray.join(" ")
    setDisplay(newDisplay)
  }
  
  //Check if word is complete or if lives are out and give the user feedback
  //Then start a new question
  const checkAnswer = async () => {
    const usersWord = displayAsArray.join("")
    if (usersWord == rightAnswer) {
      setTimeout(() => setRightLottie(true), 500)
      setTimeout(() => setRightLottie(false), 4600)

      const newGame = [...swedishGame]
      setTimeout(() => (newGame[Number(type)].score = currentScore + 1), 3000)
      setTimeout(() => setSwedishGame(newGame), 3000)
      setTimeout(() => newQuestion(), 4500)

      // Send answer to backend
      //    setTimeout(async () => {
      //      try {
      //        await registerAnswer({
      //          subject: "math",
      //          level: newGame[type].level,
      //          subcategory: subcategory,
      //         score: currentScore + 1,
      //        })
      //      } catch (err) {
      //        console.error("Error registration answer", err)
      //      }
      //    }, 3000)
    } else if (lives === 1) {
      setTimeout(() => setWrongLottie(true), 1500)
      setTimeout(() => setMessage(`Rätt svar var ${rightAnswer}.`), 2500)
      setTimeout(() => setWrongLottie(false), 4600)
      setTimeout(() => newQuestion(), 4500)
    }
  }

  //Reset message and input-field before generating new question
  const newQuestion = () => {
    setMessage("")
    setAnswerInput("")
    generateQuestion("swedish", Number(type))
    makeLines()
    setLives(10)
    setGuesses([])
    if (focusRef.current) {
      focusRef.current.focus()
    }
  }

  if (swedishGame[Number(type)].level < 4) {
    return (
      <div>
        <QuestionCard>{display}</QuestionCard>
        <Answer onSubmit={(event) => checkGuess(event)}>
          <Drawing
            src={pictures[lives]}
            alt="hangman drawing showing how many lives are left"
          />
          <ExtraDiv>
            <InputField>
              <AnswerInput
                ref={focusRef}
                value={answerInput}
                onChange={(event) => setAnswerInput(event.target.value)}
              />
              <AnswerBtn type="submit">GISSA</AnswerBtn>
            </InputField>
            <WrongGuesses>{guesses.join(" ")}</WrongGuesses>
          </ExtraDiv>
          {rightLottie && (
            <FeedbackLottie>
              <Lottie animationData={Right} loop={false} />
            </FeedbackLottie>
          )}
          {wrongLottie && (
            <FeedbackLottie>
              <Lottie animationData={Wrong} loop={false} />
            </FeedbackLottie>
          )}
        </Answer>
        <KeyboardInput setAnswerInput={setAnswerInput} focusRef={focusRef} />
        {message && <Message>{message}</Message>}
      </div>
    )
  } else {
    return <Title>Du har klarat alla nivåer! Grattis!</Title>
  }
}

const Title = styled.h1`
  margin: 0;
  font-size: 40px;

  @media (min-width: 700px) {
    font-size: 45px;
  }
`

const QuestionCard = styled.div`
  width: 300px;
  height: 100px;
  align-content: center;
  font-size: 30px;
  background-color: var(--sunset);
  color: white;
  text-shadow: 1px 1px 2px black;
  padding: 20px;
  margin: 10px auto;
  z-index: 1;
  border-radius: 20px;
  text-align: center;

  @media (min-width: 700px) {
    width: 600px;
    height: 100px;
    font-size: 50px;
  }
`

const Drawing = styled.img`
  height: 100px;

  @media (min-width: 700px) {
    height: 200px;
  }
`

const WrongGuesses = styled.p`
  margin: 0;
  font-size: 14px;
  height: 20px;
`

const Answer = styled.form`
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 8px;
  align-items: center;
  position: relative;

  @media (min-width: 700px) {
    gap: 20px;
  }
`

const AnswerInput = styled.input`
  color: #000000;
  background-color: var(--sunsethover);
  border-radius: 10px;
  width: 50px;
  height: 40px;
  border: none;
  padding: 20px;
  font-family: "Itim";
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &::placeholder {
    color: #606060;
  }

  @media (min-width: 700px) {
    width: 100px;
    height: 54px;
    font-size: 16px;
  }
`

const AnswerBtn = styled.button`
  color: white;
  text-shadow: 1px 1px 2px black;
  background-color: var(--sunset);
  border-radius: 10px;
  border: none;
  width: 60px;
  height: 40px;
  margin-top: -4px;
  cursor: pointer;
  box-shadow: 4px 4px var(--sunsetshadow);

  @media (min-width: 700px) {
    width: 70px;
    height: 50px;
    font-size: 16px;
  }

  &:hover {
    background-color: var(--sunsethover);
    background-color: var(--sunsethover);
    box-shadow: 6px 6px var(--sunsetshadow);
    transition: 0.2s ease;
  }
`

const Message = styled.div`
  color: black;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px auto;
  font-size: 18px;
`

const FeedbackLottie = styled.div`
  position: absolute;
  top: 20%;
  left: 30%;
  transform: translate(-20%, -20%);
  z-index: 2; //

  @media (min-width: 700px) {
    top: -100%;
  }
`

const InputField = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  align-items: center;
  position: relative;

  @media (min-width: 700px) {
    gap: 20px;
  }
`

const ExtraDiv = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

Hangman.propTypes = {
  focusRef: PropTypes.any,
  type: PropTypes.string,
}

/*
    #Check if guess has been made before
    if guess in guesses:
      print(f"You have already guessed {guess}")
    else:
      #Check if guessed letter is found in word

       */
