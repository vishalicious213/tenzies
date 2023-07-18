import React from "react"
import Die from "./Die"

export default function App() {
    return (
        <main>
            <section className="dice">
                <Die value={1} />
            </section>
        </main>
    )
}