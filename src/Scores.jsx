export default function Scores({highscores}) {
    console.log(highscores)
    return (
        <section className="scores">
            <h2>SCORES</h2>
            {highscores.map((score, index) => {
                return (
                    <div key={index}>Roll: {score.roll} | Time: {score.time}</div>
                )
            })}
        </section>
    )
}