import React, { useState, useEffect } from "react"
import Die from "./Die"

export default function App() {
    const [dice, setDice] = useState(allNewDice)
    const [tenzies, setTenzies] = useState(false)

    useEffect(() => {
        let winningValue = dice[0].value
        const allHeld = dice.every(die => die.isHeld)
        const sameDieValue = dice.every(die => die.value === winningValue)

        if (allHeld && sameDieValue) {
            setTenzies(true)
            console.log("YOU WON!!!")
        }
    }, [dice])

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
        // setDice(allNewDice)
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
    }

    return (
        <main>
            <h1 className="title">Tenzies</h1>
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

            <button className="roll-dice" onClick={rollDice}>{tenzies ? "New Game" : "Roll"}</button>
        </main>
    )
}