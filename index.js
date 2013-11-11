
//game configuration
var totalCards = 16, 				//total cards in the game
	totalMatches = totalCards / 2,	//one match every 2 cards
	matchesFound = 0, 				//incrementing value to keep track of how many matches have been found
	flippedCard = false,			//variable to store a card that gets flipped over
	playerErrors = 0,				//counter for number of player errors
	timePassed = 0,					//counter for the timer
	cardArray = [], 				//array to hold cards for shuffling and resetting game
	gameOver = false;

function gameInit() {
	console.log("GAME STARTING");

	var cardContainer = document.getElementById("cardContainer");
	
	var cardValueCounter = 1; //counter to create 2 of each card
	
	//Create the card elements and store in an array
	for(var i=1; i<=totalCards; i++) {
		var card = new gameCard(cardValueCounter);	
		cardArray.push(card);
		if(i % 2 == 0) { cardValueCounter++; } //increment cardValue every other loop
	}

	//quick and dirty shuffle function
	for(var j, x, i = cardArray.length; i; j = parseInt(Math.random() * i), x = cardArray[--i], cardArray[i] = cardArray[j], cardArray[j] = x);
	
	//add cards to screen
	for(var i in cardArray) {
		cardContainer.appendChild(cardArray[i]);	
	}
	
	//start the timer
	timerInit();
	
}

function timerInit() {
	var timer = document.getElementById("timer");
	var timerInterval = setInterval(function(){
		if(!gameOver) {
			timePassed++;
			
			var minutes = Math.floor(timePassed / 60);
			var seconds = timePassed % 60;
			
			minutes = minutes < 10 ? "0"+minutes : minutes;
			seconds = seconds < 10 ? "0"+seconds : seconds;
			
			timer.innerHTML = minutes+":"+seconds;
		} else {
			clearInterval(timerInterval);
		}
	}, 1000);
}

function addFlippedCard(card) {
	//if there's not a card flipped over, flip one. Else check for a match
	if(!flippedCard) {
		card.selectCard();
		flippedCard = card;
	} else {
		if(card.cardValue == flippedCard.cardValue) {
			//match found
			card.selectCard();
			flippedCard = false;
			
			matchesFound++;
			
			//If all matches are found, end the game
			if(matchesFound == totalMatches) {
				endGame();
			}
		} else {
			//No match. Flip cards back over and add error
			card.selectCard();
			addPlayerError();
			
			//set a timeout so both cards are shown, then flip back over together
			setTimeout(function(){
				card.deselectCard();
				flippedCard.deselectCard();
			
				flippedCard = false;
			}, 500);
		}
	}
}

function addPlayerError() {
	playerErrors++;
	var errorDisplay = document.getElementById("playerErrors");
	errorDisplay.innerHTML = playerErrors;
}

function endGame() {
	gameOver = true;
	alert("You Win!");
	
	var restartButton = document.createElement("input");
	restartButton.setAttribute("type", "button");
	restartButton.setAttribute("value", "RESTART");
	restartButton.setAttribute("size", "50");
	
	restartButton.onclick = function(){ window.location.href = "index.html"; }
	
	document.getElementById("sidebar").appendChild(restartButton);
}

//Constructor for the card elements
var gameCard = function(cardValue) {
	
	var card = document.createElement("div");
	card.setAttribute("class","gameCard");
	
	//card properties for game
	card.cardValue = cardValue;
	card.selected = false;
	
	//card methods for game
	card.selectCard = function() {
		this.flipper.classList.add('flipped'); //triggers the flip animation by adding the flipped class
		this.selected = true;
	}
	
	card.deselectCard = function() {
		this.flipper.classList.remove('flipped'); //triggers the flip animation by removing the flipped class
		this.selected = false;
	}
	
	//****************DOM Elements for the card
	//create the flipper
	card.flipper = document.createElement("div");
	card.flipper.setAttribute("class","flipper");
	card.appendChild(card.flipper);
	
	//create the front and back elements of the card
	var cardFront = document.createElement("div");
	cardFront.setAttribute("class", "cardFront");
	cardFront.style.backgroundPosition = (cardValue * 150) + "px 0px";
	//cardFront.style.backgroundPositionX = (cardValue * 150) + "px";
	//cardFront.style.backgroundPositionY = "0px";

	var cardBack = document.createElement("div");
	cardBack.setAttribute("class", "cardBack");
	
	card.flipper.appendChild(cardFront);
	card.flipper.appendChild(cardBack);
	
	
	
	//add a listener for the clicks
	card.onclick = function(){
		if(!this.selected) {
			addFlippedCard(this);	
		}
	};
	return card;
}