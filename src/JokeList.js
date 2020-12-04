import React, { useState, useEffect } from "react";
import Joke from "./Joke";
import axios from "axios";
import uuid from "uuid/v4";
import "./JokeList.css";

function JokeList (props) {
  
  const [state, setState] = useState(JSON.parse(window.localStorage.getItem("jokes") || "[]"));

  const [load, setLoad] = useState(false);

  let seenJokes = new Set(state.map(j => j.text));

 useEffect(()=>{
   if (state.length === 0) getJokes();
},[])

 async function getJokes() {
   try {
     let jokes = [];
     while (jokes.length < 10) {
       let res = await axios.get("https://icanhazdadjoke.com/", {
         headers: { Accept: "application/json" }
       });
       let newJoke = res.data.joke;
       if (!seenJokes.has(newJoke)) {
         jokes.push({ id: uuid(), text: newJoke, votes: 0 });
       } else {
         console.log("FOUND A DUPLICATE!");
         console.log(newJoke);
       }
     }
     setLoad(false);
     setState([...state,...jokes]);
   } catch (e) {
     alert(e);
     setLoad(false);
   }
 }

 function handleVote(id, delta) {
   setState(state.map(j =>
     j.id === id ? { ...j, votes: j.votes + delta } : j
     )
     );
 }

 useEffect(()=>{
  window.localStorage.setItem("jokes", JSON.stringify(state));
},[state])

function handleClick() {
 setLoad(true);
   getJokes()
 }
 
   if (load) {
     return (
       <div className='JokeList-spinner'>
         <i className='far fa-8x fa-laugh fa-spin' />
         <h1 className='JokeList-title'>Loading...</h1>
       </div>
     );
   }
   let jokes = state.sort((a, b) => b.votes - a.votes);
   return (
     <div className='JokeList'>
       <div className='JokeList-sidebar'>
         <h1 className='JokeList-title'>
           <span>Dad</span> Jokes
         </h1>
         <img src='https://assets.dryicons.com/uploads/icon/svg/8927/0eb14c71-38f2-433a-bfc8-23d9c99b3647.svg' />
         <button className='JokeList-getmore' onClick={handleClick}>
           Fetch Jokes
         </button>
       </div>

       <div className='JokeList-jokes'>
         {jokes.map(j => (
           <Joke
             key={j.id}
             votes={j.votes}
             text={j.text}
             upvote={() => handleVote(j.id, 1)}
             downvote={() => handleVote(j.id, -1)}
           />
         ))}
       </div>
     </div>
   );
 
  }
  
  export default JokeList;

    
