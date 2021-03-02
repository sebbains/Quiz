const username = document.querySelector('#username');
const saveScoreButton = document.querySelector('#saveScoreBtn');
const mostRecentScore = localStorage.getItem('mostRecentScore');
const finalScore = document.querySelector('#finalScore');
const MAX_HIGH_SCORES = 5;
// grab top scores
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];
// show last score
finalScore.innerText = mostRecentScore;

// once name entered allow to submit
username.addEventListener("keyup", () => {
    saveScoreButton.disabled = !username.value;
})

// submit score
function saveHighScore(e){
    e.preventDefault();
    const score = {
        score: mostRecentScore,
        name: username.value
    }
    // add, sort, limit and update local
    highScores.push(score);
    highScores.sort((a, b) =>  b.score - a.score);
    highScores.splice(MAX_HIGH_SCORES);
    localStorage.setItem("highScores", JSON.stringify(highScores));

    window.location.assign("/");
}