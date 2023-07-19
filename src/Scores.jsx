export default function Scores({scores}) {
    const sortedByTime = scores.sort(function(a, b){return a.time - b.time})
    const sortedByRolls = scores.sort(function(a, b){return a.roll - b.roll})
    return (
        <section className="scores">
            <h2>SCORES</h2>
            <div className="scores-header">
                <div>ROLLS</div>
                <div>TIME</div>
            </div>
            {sortedByTime.map((score, index) => {
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