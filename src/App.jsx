import React, { useState, useEffect } from "react"
import Die from "./Die"

export default function App() {
    const [dice, setDice] = useState(allNewDice)
    const [tenzies, setTenzies] = useState(false)

    useEffect(() => {
        console.log("Dice state changed")
        let isHeldCount = 0
        let winningValue = dice[0].value
        let sameDieValue = false

        const allHeld = dice.every(die => die.isHeld)
        console.log("All dice held", allHeld)

        dice.forEach(die => {
            if (die.isHeld) {
                isHeldCount ++
            }
            // console.log("Held dice", isHeldCount)

            if (die.value === winningValue) {
                sameDieValue = true
            } else {
                sameDieValue = false
            }
            // console.log("Same die value", sameDieValue)
        })

        if (isHeldCount === 10 && sameDieValue) {
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

            <button className="roll-dice" onClick={rollDice}>Roll</button>
        </main>
    )
}