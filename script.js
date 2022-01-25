import express from 'express';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors);

const usuarios = [];

app.post('/sign-up', (req, res) => {
  const usuario = req.body;
  usuarios.push(usuario);
  res.send("OK");
});

const tweets = [];

app.post('/tweets', (req, res) => {
  const tweet = req.body;
  tweets.push(tweet);
  res.send("OK");
});

app.get('/tweets', (req, res) => {
  if (tweets.length<10)
  {
    res.send(tweets);
  }
  else
  {
      res.send(tweets.slice(Math.max(tweets.length - 10, 0)));  
  }
});

app.listen(5000);



let _username = "";

function signUp() {
  const username = document.querySelector("#username").value;
  const picture = document.querySelector("#picture").value;

  axios.post("http://localhost:5000/sign-up", {
    username,
    avatar: picture
  }).then(() => {
    _username = username;
    loadTweets();
  }).catch(err => {
    console.error(err);
    alert("Erro ao fazer cadastro! Consulte os logs.");
  });
}

function loadTweets() {
  axios.get("http://localhost:5000/tweets").then(res => {
    const tweets = res.data;
    let tweetsHtml = '';

    for (const tweet of tweets) {
      tweetsHtml += `
        <div class="tweet">
          <div class="avatar">
            <img src="${tweet.avatar}" />
          </div>
          <div class="content">
            <div class="user">
              @${tweet.username}
            </div>
            <div class="body">
              ${escapeHtml(tweet.tweet)}
            </div>
          </div>
        </div>
      `;
    }

    document.querySelector(".tweets").innerHTML = tweetsHtml;
    document.querySelector(".pagina-inicial").classList.add("hidden");
    document.querySelector(".tweets-page").classList.remove("hidden");
  });
}

function postTweet() {
  const tweet = document.querySelector("#tweet").value;

  axios.post("http://localhost:5000/tweets", {
    username: _username,
    tweet
  }).then(() => {
    document.querySelector("#tweet").value = "";
    loadTweets();
  }).catch(err => {
    console.error(err);
    alert("Erro ao fazer tweet! Consulte os logs.")
  })
}

function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
 }



 