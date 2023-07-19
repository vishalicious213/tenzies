import { useState } from "react"

export default function Scores({scores}) {
    const [scoreArray, setScoreArray] = useState(scores)
    const sortedByRolls = [...scoreArray].sort((a, b) => a.roll - b.roll)
    const sortedByTime = [...scoreArray].sort((a, b) => a.time - b.time)

    return (
        <section className="scores">
            <h2>SCORES</h2>
            <div className="scores-header">
                <button onClick={() => setScoreArray(sortedByRolls)}>ROLLS</button>
                <button onClick={() => setScoreArray(sortedByTime)}>TIME</button>
            </div>

            {scoreArray.map((score, index) => {
                return (
                    <div className="scoreboard" key={index}>
                        <div>{score.roll}</div>
                        <div>{score.time}s</div>
                    </div>
                )
            })}
        </section>
    )
}