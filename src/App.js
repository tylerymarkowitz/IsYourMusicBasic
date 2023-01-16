import { useEffect, useState } from "react";
import './App.css';
import axios from 'axios';

function App() {
  const CLIENT_ID = "aa15995912fe42b795a6dbca1cb95548"
  const REDIRECT_URI = "https://tylerymarkowitz.github.io/IsYourSpotifyBasic/"
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  const scopes = [
    "user-top-read",
  ];

  const [token, setToken] = useState("")
  //unused
  const [score, setScore] = useState(0)
  //artist name, artist popularity score, artist img url
  const [mostBasicArtist, setMostBasicArtist] = useState(['', 0, ''])
  const [leastBasicArtist, setLeastBasicArtist] = useState(['', 0, ''])


  useEffect(() => {
    const hash = window.location.hash
    let token = window.localStorage.getItem("token")
    if (!token && hash) {
      token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

      window.location.hash = ""
      window.localStorage.setItem("token", token)
    }
    setToken(token)
    getUserData(token);
  }, [])

  const logout = () => {
    setToken("")
    window.localStorage.removeItem("token")
  }



  //get user data and calculate score, most, and least basic artists
  const getUserData = async (token) => {
    const headers = {
      "Authorization": "Bearer " + token
    };
    await axios.get("https://api.spotify.com/v1/me/top/artists", { headers }).then((response) => {
      let totalScore = 0;
      let mostBasicArtist = [response.data.items[0].name, response.data.items[0].popularity]
      let leastBasicArtist = [response.data.items[0].name, response.data.items[0].popularity]
      for (var i = 0; i < response.data.items.length; i++) {
        let currScore = response.data.items[i].popularity
        totalScore += currScore
        if (currScore > mostBasicArtist[1]) {
          mostBasicArtist[0] = response.data.items[i].name
          mostBasicArtist[1] = currScore
          mostBasicArtist[2] = response.data.items[i].images[0].url
        }
        if (currScore < leastBasicArtist[1]) {
          leastBasicArtist[0] = response.data.items[i].name
          leastBasicArtist[1] = currScore
          leastBasicArtist[2] = response.data.items[i].images[0].url
        }
      }
      setScore(totalScore / response.data.items.length)
      setMostBasicArtist(mostBasicArtist)
      setLeastBasicArtist(leastBasicArtist)
    })
  }


  const renderScore = () => {
    return <div>Your Spotify is: <br /> <h2>{score}% Basic</h2></div>
  }

  const renderMostBasicArtist = () => {
    return <div class="element">Most Basic Artist: <br />
      {mostBasicArtist[0]}<br />
      <img width={"50%"} src={mostBasicArtist[2]} alt="" /> <br />
      {mostBasicArtist[1]}% basic
    </div>
  }

  const renderLeastBasicArtist = () => {
    return <div class="element">Least Basic Artist: <br />
      {leastBasicArtist[0]}<br />
      <img width={"50%"} src={leastBasicArtist[2]} alt="" /> <br />
      {leastBasicArtist[1]}% basic
    </div>

  }


  return (
    <div className="App">
      <header className="App-header">
        <h1>How Basic Is Your Spotify?</h1>


        {token ?
          <div>{renderScore()}
            {renderMostBasicArtist()}
            {renderLeastBasicArtist()}
          </div>
          : 
          <div>
          <h4>Created by <a href = "https://www.linkedin.com/in/tylerymarkowitz/" target='_blank' >Tyler</a></h4>
          </div>
        }
        {!token ?
          // <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>Login to Spotify</a>
          <a href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${scopes.join(
            "%20"
          )}&response_type=token&show_dialog=true`}>Login</a>
          :
          <button onClick={logout}>Logout</button>

        }




      </header>
    </div>
  );
}


export default App;
