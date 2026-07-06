import DotBg from "./DotBg"
import HomeBentoSection from "./HomeBentoSection"
import DashboardBentoSection from "./DashboardBentoSection"
import "./Home.css"

function Home() {
    return (
        <main className="home">
            <DotBg />

            <div className="home-overlay" />

            <div className="home-content">
                <HomeBentoSection />
                <DashboardBentoSection />
            </div>
        </main>
    )
}

export default Home