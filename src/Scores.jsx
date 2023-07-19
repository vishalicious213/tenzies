export default function Scores({scores}) {
    console.log(scores)
    return (
        <section className="scores">
            <h2>SCORES</h2>
            {scores.map((score, index) => {
                return (
                    <div key={index}>Rolls: {score.roll} | Time: {score.time}</div>
                )
            })}
        </section>
    )
}