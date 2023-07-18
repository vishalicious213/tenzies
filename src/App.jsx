import React, { useState } from "react"
import Die from "./Die"

export default function App() {
    const [dice, setDice] = useState(allNewDice)

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

    function rollDice() {
        setDice(allNewDice)
    }

    function holdDice(id) {
        console.log(id)
    }

    return (
        <main>
            <section className="dice-container">
                {/* spot, below is the index for each die in the array */}
                {dice.map((die, spot) => (
                    <Die 
                        key={spot} 
                        value={die.value} 
                        isHeld={die.isHeld} 
                        id={spot}
                        holdDice={holdDice}
                    />
                ))}
            </section>

            <button className="roll-dice" onClick={rollDice}>Roll</button>
        </main>
    )
}