//External imports for handling basic functionality
import { useState, useEffect } from "react"
import PropTypes from "prop-types"

//For handling UI
import styled, { css } from "styled-components"
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

export const Hangman = ({ focusRef, type }) => {
  const { swedishGame, setSwedishGame, rightAnswer, generateQuestion, registerAnswer } =
    useLanguage()
  const currentScore = swedishGame[Number(type)].score

  const [message, setMessage] = useState("")
  const [lives, setLives] = useState(10)
  const pictures = [gubbe11, gubbe10, gubbe9, gubbe8, gubbe7, gubbe6, gubbe5, gubbe4, gubbe3, gubbe2, gubbe1]
  const [question, setQuestion] = useState("")
  const [answerInput, setAnswerInput] = useState("")
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
  const [rightLottie, setRightLottie] = useState(false)
  const [wrongLottie, setWrongLottie] = useState(false)
  //const subcategory = mathGame[Number(type)].subcategory

  const makeLines = () => {
    let line = ""
    for (let x of rightAnswer) {
      line += "_ "
    }
    setQuestion(line)
  }

  useEffect(() => {
    generateQuestion("swedish", Number(type))
    makeLines()
    if (focusRef.current) {
      focusRef.current.focus()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  //Checks if input matches correctAnswer and gives the user a message of "right/wrong"
  //Then starts a new question
  const checkAnswer = async (event) => {
    event.preventDefault()
    if (answerInput == rightAnswer) {
      setTimeout(() => setRightLottie(true), 500)
      setTimeout(() => setRightLottie(false), 4600)

      const newGame = [...swedishGame]
      setTimeout(() => (newGame[Number(type)].score = currentScore + 1), 3000)
      setTimeout(() => setSwedishGame(newGame), 3000)

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
    } else {
      setTimeout(() => setWrongLottie(true), 500)
      setTimeout(
        () =>
          setMessage(`Rätt svar var ${rightAnswer}.`),
        2500
      )
      setTimeout(() => setWrongLottie(false), 4600)
    }
    setTimeout(() => newQuestion(), 4500)
  }

  //Resets message and input-field before generating new question
  const newQuestion = () => {
    setMessage("")
    setAnswerInput("")
    generateQuestion("swedish", Number(type))
    makeLines()
    if (focusRef.current) {
      focusRef.current.focus()
    }
  }

  const checkGuess = async (event) => {
    event.preventDefault()
    if ( rightAnswer.includes(answerInput) ) {
      setQuestion("Yey")
    } else {
      setQuestion("No")
    }
  }

  //Puts users click on number-buttons into the inputfield
  const handleNumPadClick = (number) => {
    setAnswerInput((prev) => prev + number.toString())
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

  if (swedishGame[Number(type)].level < 4) {
    return (    
      <div>
        <QuestionCard>{question}</QuestionCard>
        <Drawing src={pictures[lives]} alt="hangman drawing showing how many lives are left" />
        <Answer onSubmit={(event) => checkGuess(event)}>
          <AnswerInput
            ref={focusRef}
            value={answerInput}
            onChange={(event) => setAnswerInput(event.target.value)}
          />
          <AnswerBtn type="submit">GISSA</AnswerBtn>
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
        <NumPad>
          {numPadNumbers.map((number) => (
            <NumPadBtn
              key={number}
              className="small"
              onClick={() => handleNumPadClick(number)}
            >
              {number}
            </NumPadBtn>
          ))}
          <NumPadBtn
            key="0"
            className="big"
            onClick={() => handleNumPadClick(0)}
          >
            0
          </NumPadBtn>
          <NumPadBtn className="delete" onClick={handleDeleteClick}>
            🗑️
          </NumPadBtn>
        </NumPad>
        {message && <Message>{message}</Message>}
      </div>      
    )
  } else {
    return <Title>Du har klarat alla nivåer! Grattis!</Title>
  }
}

const Title = styled.h1`
  margin: 0;
  font-size: 40px; //

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
    height: 150px;
    font-size: 50px;
  }
`

const Drawing = styled.img`
  height: 300px
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
  width: 200px;
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

const NumPad = styled.div`
  display: grid;
  grid-template-rows: 4;
  grid-template-columns: 3;
  gap: 10px;
  max-width: 270px;
  margin: 10px auto;
`

const NumPadBtn = styled.button`
  ${(props) =>
    props.className === "small" &&
    css`
      grid-column: span 1;
      grid-row: span 1;
      width: 80px;
    `}

  ${(props) =>
    props.className === "big" &&
    css`
      grid-column: span 2;
      grid-row: 4;
      width: 175px;
    `}

  ${(props) =>
    props.className === "delete" &&
    css`
      grid-column: 3;
      grid-row: 4;
      width: 80px;
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

Hangman.propTypes = {
  focusRef: PropTypes.any,
  type: PropTypes.string,
}

/*print(hangman_art.logo)

#What should be shown to user
display = []

#Keep track of guessed letters
guesses = []

#Loop through guesses and check them
while not end_of_game:
    guess = input("Guess a letter: ").lower()
    clear()
  
    #Check if guess has been made before
    if guess in guesses:
      print(f"You have already guessed {guess}")
    else:
      #Check if guessed letter is found in word
      for position in range(word_length):
          letter = chosen_word[position]
          if letter == guess:
              display[position] = letter
            
      #Check if guess is wrong
      if guess not in chosen_word:
        guesses += guess
        print(f"Sorry, {guess} is not found in the word.")
        lives -= 1
      else:
        print("Good guess")
        
    print(' '.join(display))
    print(stages[lives])
    print(' '.join(guesses))

    #Check for end of game
    if lives == 0:
      end_of_game = True
      print("You lose.")
      print(f"Correct answer was {chosen_word}")
    if "_" not in display:
      end_of_game = True
      print("You win.")

       */
