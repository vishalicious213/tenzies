import React, { useState, useEffect } from "react"
import Die from "./Die"
import Scores from "./Scores"
import Confetti from "react-confetti"

export default function App() {
    const [dice, setDice] = useState(allNewDice)
    const [tenzies, setTenzies] = useState(false)
    const [rolls, setRolls] = useState(0)
    const [time, setTime] = useState(0)
    const [countingTime, setCountingTime] = useState(false)
    const [seeScores, setSeeScores] = useState(false)
    const [highScores, setHighScores] = useState(JSON.parse(localStorage.getItem("tenzies")) || [])

    // when countingTime is true, start incrementing with setTime
    useEffect(() => {
        let timerInterval

        if (countingTime) {
            timerInterval = setInterval(() => {
                setTime(prevTime => prevTime + 1)
            }, 1000)
        } else {
            clearInterval(timerInterval)
        }

        return () => {
            clearInterval(timerInterval)
        }
    }, [countingTime])

    // win game if tenzies is true / stop timer
    useEffect(() => {
        let winningValue = dice[0].value
        const allHeld = dice.every(die => die.isHeld)
        const sameDieValue = dice.every(die => die.value === winningValue)

        if (allHeld && sameDieValue) {
            setTenzies(true)
            stopTimer()
            setHighScores(prevHighScore => [
                ...prevHighScore,
                {
                    roll: rolls, 
                    time: time
                }
            ])
        }
    }, [dice])

    // save highscore to localStorage
    useEffect(() => {
        localStorage.setItem("tenzies", JSON.stringify(highScores))
    }, [highScores])

    // get new set of dice to start game
    function allNewDice() {
        let newDice = []

        for (let i = 0; i < 10; i++) {
            newDice.push({
                value: (Math.ceil(Math.random() * 6)),
                isHeld: false
            })
        }

        return newDice
    }

    // roll new values for dice that are not held
    function rollDice() {
        if (!tenzies) {
            setDice(prevDice => {
                return prevDice.map((die, index) => {
                    if (die.isHeld) {
                        return die
                    }
                    return {
                        value: (Math.ceil(Math.random() * 6)),
                        isHeld: false
                    }
                })
            })
            setRolls(rolls => rolls + 1)
        } else {
            setTenzies(false)
            setDice(allNewDice)
            setRolls(0)
            setCountingTime(false)
            setTime(0)
        }
    }

    // freeze clicked dice from being rerolled
    function holdDice(id) {
        setDice(prevDice => {
            return prevDice.map((die, index) => {
                if (index === id) {
                    return {
                        ...die,
                        isHeld: !die.isHeld
                    }
                }
                return die
            })
        })

        setCountingTime(true)
    }

    function stopTimer() {
        setCountingTime(false)
    }

    function showScores() {
        // console.log("Showing scores")
        setSeeScores(prevState => !prevState)
        
    }

    function Game() {
        return (
            <>
                <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>

                <section className="dice-container">
                    {dice.map((die, index) => (
                        <Die 
                            key={index} 
                            value={die.value} 
                            isHeld={die.isHeld} 
                            holdDice={() => holdDice(index)}
                        />
                    ))}
                </section>

                <section className="stats">
                    <div className="rolls">Rolls: {rolls}</div>
                    <div className="time">Time: {time}s</div>
                </section>

                <button className="roll-dice" onClick={rollDice}>{tenzies ? "New Game" : "Roll"}</button>
            </>
        )
    }

    return (
        <main>
            {tenzies && <Confetti />}

            <h1 className="title">Tenzies</h1>
            <div id="see-scores" onClick={showScores}>
                {seeScores ? "Hide high scores" : "See high scores"}
            </div>

            {seeScores ? <Scores scores={highScores} /> : <Game />}
        </main>
    )
}