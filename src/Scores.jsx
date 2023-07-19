export default function Scores({scores}) {
    return (
        <section className="scores">
            <h2>SCORES</h2>
            <div className="scores-header">
                <div>ROLLS</div>
                <div>TIME</div>
            </div>
            {scores.map((score, index) => {
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