export default function Die(props) {
    return (
        <div 
            className={props.isHeld ? "die-face held" : "die-face"}
            onClick={() => props.holdDice(props.id)}
        >
            <h2 className="die-num">{props.value}</h2>
        </div>
    )
}