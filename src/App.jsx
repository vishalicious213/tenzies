import React, { useState, useEffect } from "react"
import Die from "./Die"
import Scores from "./Scores"
import Confetti from "react-confetti"
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, off, remove, set } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"


export default function App() {
    const [dice, setDice] = useState(allNewDice)
    const [tenzies, setTenzies] = useState(false)
    const [rolls, setRolls] = useState(0)
    const [time, setTime] = useState(0)
    const [countingTime, setCountingTime] = useState(false)
    const [seeScores, setSeeScores] = useState(false)
    // const [highScores, setHighScores] = useState(JSON.parse(localStorage.getItem("tenzies")) || [])
    const [highScores, setHighScores] = useState([])
    
    // FIREBASE
    const appSettings = {
        databaseURL: "https://tenzies-cb2d4-default-rtdb.firebaseio.com/"
    }
    const app = initializeApp(appSettings)
    const database = getDatabase(app)
    const tenziesDB = ref(database, "tenzies")
    // console.log(tenziesDB.key)

    // console.log(app)

// ⬇️ USEEFFECTS ⬇️

    // if snapshot exists, load it into state
    useEffect(() => {
        onValue(tenziesDB, function(snapshot) {
            if (snapshot.exists()) {
                let scoresArray = Object.values(snapshot.val())
                console.log("scoresArray from firebase", scoresArray)
                // console.log(scoresArray[0])
                off(tenziesDB)
                setHighScores([...scoresArray])
                console.log("loaded scores from snapshot", highScores)
            }
        })
    }, [])

    useEffect(() => {
        console.log("loaded scores from snapshot", highScores)
    }, [highScores])

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

    // win game if tenzies is true / stop timer / add to high scores
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
            console.log("set high after game", highScores)
    
            // onValue(tenziesDB, function(snapshot) {
            //     console.log("snap-start", highScores)
            //     updateScoresinDB(snapshot)
                // if (snapshot.exists()) {
                //     set(tenziesDB, highScores)
                //     console.log("set", highScores)
                //     // off(tenziesDB)
                // } else {
                //     push(tenziesDB, highScores)
                //     console.log("push", highScores)
                // }
            // })
        }
    }, [dice])

    useEffect(() => {
        onValue(tenziesDB, function(snapshot) {
            console.log("snap-start", highScores)
            updateScoresinDB(snapshot)
        })
    }, [highScores])

    async function updateScoresinDB(snapshot) {
        if (snapshot.exists()) {
            await set(tenziesDB, highScores)
            console.log("set", highScores)
            off(tenziesDB)
        } else {
            await push(tenziesDB, highScores)
            console.log("push", highScores)
        }
    }

    // save highscore to localStorage
    // useEffect(() => {
    //     localStorage.setItem("tenzies", JSON.stringify(highScores))
    //     // push(tenziesDB, JSON.stringify(highScores))
    //     // let itemToRemove = ref(tenziesDB, tenziesDB.key)
    //     // remove(itemToRemove)
    //     set(tenziesDB, highScores)
    // }, [highScores])

// ⬇️ HELPER FUNCTIONS ⬇️

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
        if (!tenzies) {
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
    }

    function stopTimer() {
        setCountingTime(false)
    }

    function showScores() {
        setSeeScores(prevState => !prevState)
        
    }

// ⬇️ RENDER FUNCTIONS ⬇️

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