async function clearScoreboardData(){
 console.log("window.location.href", window.location.href);
 console.log("window.location.href == 'http://localhost:3000/scoreboard'", window.location.href == 'http://localhost:3000/scoreboard');
 try {
  const res = await fetch('http://localhost:3000/clearScoreboard', {
   method: 'GET',
  });
 } catch (e) {
  console.log(e);
 };
};

async function clearScoreboard(){
 try {
  await clearScoreboardData();
 } catch (error) {
  
 };

 console.log("window.location.href", window.location.href);
 console.log("window.location.href == 'http://localhost:3000/scoreboard'", window.location.href == 'http://localhost:3000/scoreboard');

 if (window.location.href == 'http://localhost:3000/scoreboard') {
 console.log("running if()"); 

 };
 window.location.reload();
 return false;
 // window.location.reload();
}