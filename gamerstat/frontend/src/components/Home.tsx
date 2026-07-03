import DotBg from "./DotBg"
import BentoSection from "./BentoSection"
import "./Home.css"

function Home() {
    return (
        <main className="home">
            <DotBg />

            <div className="home-overlay" />

            <div className="home-content">
                <BentoSection />
            </div>
        </main>
    )
}

export default Home