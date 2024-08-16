import { BrowserRouter, Routes } from "react-router-dom"
import routes from "./routes/routes"
import { Header } from "./components/Header"
import { UserProvider } from "./contexts/UserContext"
import { LanguageProvider } from "./contexts/LanguageContext"
import { MathProvider } from "./contexts/MathContext"
import "./App.css"

export const App = () => {
  return (
    <>
      <BrowserRouter>
        <UserProvider>
          <LanguageProvider>
            <MathProvider>
              <Header />
              <main>
                <Routes>{routes}</Routes>
              </main>
            </MathProvider>
          </LanguageProvider>
        </UserProvider>
      </BrowserRouter>
    </>
  )
}
