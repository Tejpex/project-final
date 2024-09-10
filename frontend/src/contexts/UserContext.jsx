/* eslint-disable react-refresh/only-export-components */
import PropTypes from "prop-types"
import { createContext, useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const UserContext = createContext()

export const UserProvider = ({ children }) => {
  //Users name
  const [user, setUser] = useState(null)
  //Is the user logged in?
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  //Is the user logged in correctly?
  const [authenticated, setAuthenticated] = useState({
    accessToken: localStorage.getItem("accessToken"),
    auth: false,
  })
  //Handles animation for loading
  const [loading, setLoading] = useState(false)
  //Handles side panel for log-in/register
  const [isPanelOpen, setIsPanelOpen] = useState(false)

  const navigate = useNavigate()

  //const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:4000"
  const apiUrl = "https://technigo-pluggin.onrender.com" || "http://localhost:4000"

  //Load username from localStorage
  useEffect(() => {
    const firstName = localStorage.getItem("firstName")
    if (firstName) {
      setUser({ firstName: firstName })
    }
  }, [])

  const login = async (loginData, accessToken) => {
    setLoading(true);
    try {
      // Ensure this points to the correct backend URL
      const response = await fetch(`${apiUrl}/sessions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });
      if (!response.ok) {
        console.info("Login failed");
        throw new Error("Failed to get user");
      }

      const data = await response.json();

      // Save accesstoken and username in local storage
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("firstName", data.firstName);
      setAuthenticated({
        accessToken,
        auth: true,
      });

      setUser({
        firstName: data.firstName,
      });

      setIsLoggedIn(true);
      setLoading(false);
      navigate("/spela");
      setIsPanelOpen(false);
    } catch (err) {
      console.error("No user was found:", err)
      setLoading(false);
      throw new Error("Invalid username or password")
    }
  }

  //Signs out user
  const signout = () => {
    //Removes data from localStorage
    localStorage.removeItem("accessToken")
    localStorage.removeItem("firstName")
    //Why do we have double states for logged in???
    setIsLoggedIn(false)
    setAuthenticated({
      auth: false,
    })
    //Navigates to home page
    navigate("/")
  }

  //Creates a new user by sending userData to MongoDB
  const registerUser = async (userData) => {
    setLoading(true)
    try {
      //Ensure this points to the correct backend URL
      const response = await fetch(`${apiUrl}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        throw new Error("Failed to register user")
      }

      const data = await response.json()
      //console.info("Registration success", data)

      //Keeps user logged in
      localStorage.setItem("accessToken", data.accessToken)
      localStorage.setItem("firstName", data.firstName)
      setAuthenticated({
        accessToken: data.accessToken,
        auth: true,
      })

      //Do we need this? Its also stored in localStorage
      //Sets users name as variable
      setUser({
        firstName: data.firstName,
      })

      //Do we need this? We also have setAuthenticated
      setIsLoggedIn(true)

      //Turns of loading-animation, closes side-panel and navigates to new page
      setLoading(false)
      navigate("/spela")
      setIsPanelOpen(false)

    } catch (err) {
      //Add message to user
      console.error("Error registering new user:", err)
    }
  }

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        isLoggedIn,
        setIsLoggedIn,
        authenticated,
        login,
        signout,
        registerUser,
        loading,
        apiUrl,
        isPanelOpen,
        setIsPanelOpen,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
export const useUser = () => useContext(UserContext)

UserProvider.propTypes = {
  children: PropTypes.any,
}
