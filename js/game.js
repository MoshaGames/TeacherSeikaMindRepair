$(document).ready(function () {

	var game_id			= 0,
		mathChallenges  = '[role="start-math-challenge"]',
		countDownTimer  = '#count-down-timer',
		timeDownTimer   = '#time-down-timer',
		countDownNumber = '[role="count-down-number"]',
		timeDownNumber  = '[role="time-down-number"]',
		answerOption    = '[role="answer-option"]',
		startScreen	    = '#start-screen',
		mathBuild	    = '#math-build',
		answerList		= '#answer-list',
		teacherSeika	= '#obj-TSeika',
		startGame	    = '[role="start-game"]',
		scoreTrack	    = '[role="score-track"]',
		HighestScoreTrack = '[role="highest-score-track"]',
		gameBody	    = '[role="game-body"]',
		mathRound		= 1,
		url				= window.url,
		gamePath		= window.gamePath,
		user_id			= $.user_id(),
		countDown	    = '#count-down';


	$('body').on('click', startGame, function(e) {
		
		var game = Number( $(startGame).attr('data-id') );

		game_id = game;

		$.startGame('start', { game: game });

		$.playSFX('Tap', '[role="start-game"]', 1, { type: 'mp3' });

		$.fullscreen('start', $('body')[0]);


	}).on('click', answerOption, function(e) {

		e.preventDefault();
		
		var Obj		 = this,
			operator = $(Obj).attr('data-option');

		$.startGame('answer', { operator: operator, Obj: Obj });

		mathRound++;

	});

	$.startGame = function(mode, options) {

		var options = options || {};

		//alert('test');
	
		switch (mode)
		{
			case 'start':

				$(startScreen).hide();

				$.startGame('countDown', options);

			break;

			case 'timerDown':

				if ( $(timeDownTimer)[0] ) {
					return false;
				}

				var startCounter    = 20,
					timeDownBuild  = '<div id="time-down-timer" class="circle-area button-bigger animated 1s"><span role="time-down-number" class="circle-text center noEvents">' + startCounter + '</span><div>';

				$(timeDownBuild).prependTo(gameBody);

				$.doTimeout(1000, function() {
				
					var startCounter = Number( $(timeDownNumber).text() );

					if ( startCounter >= 2 )
					{
						$(timeDownNumber).text( startCounter - 1 );
						return true;
					}
					else {

						//$(countDownTimer).effecCss('fadeOut');
						$(timeDownNumber).hide();

						$.startGame('finish', options);

						return false;
					}

				});

			break;

			case 'countDown':

				if ( $(countDownTimer)[0] ) {
					return false;
				}

				var startCounter    = 3,
					countDownBuild  = '<div id="count-down-timer"><span role="count-down-number">' + startCounter + '</span><div>',
					newMode			= options.game;

				//alert(newMode);
				
				$(countDownBuild).appendTo(gameBody);

				if ( $.isFunction($.playBGM) ) {
					$.playBGM('start', { Obj: gameBody, bgm: 'Magic-Clock-Shop_Looping', loop: 1 });
				}

				$.doTimeout(1000, function() {
				
					var startCounter = Number( $(countDownNumber).text() );

					if ( startCounter >= 2 )
					{
						$(countDownNumber).text( startCounter - 1 );
						return true;
					}
					else {

						//$(countDownTimer).effecCss('fadeOut');
						$(countDownTimer).remove();

						$.startGame('timerDown', options);
						$.startGame('score', options);

						$.startGame(newMode, options);

						return false;
					}

				});

				/*var countDownInterval = setInterval(function(){ 

					var startCounter = Number( $(countDownNumber).text() );

					if ( startCounter >= 1 )
					{
						$(countDownNumber).text( startCounter - 1 );
						return true;
					}
					else {

						$(countDownTimer).hide();

						var newMode = options.game;

						$.startGame(newMode, options);

						clearInterval(countDownInterval);

						return false;
					}

				
				$(countDownTimer).hide();

				var newMode = options.game;

				$.startGame(newMode, options);*/

				//		clearInterval(countDownInterval);



			break;

			case 2:
			case '2':

				if ( $('#math-build')[0] )
				{
					return false;
				}

					var numAObfuscated = '',
						numBObfuscated = '',
						operatorObfuscated = '',
						obfuscate	= 1;

				if ( mathRound > 5 )
				{
					var NumA		= $.getRandomInt(1,50),
						operators	= ['+', '-', 'x', '/'];
						operator    = operators[ $.getRandomInt(0, operators.length - 1) ],
						NumB		= ( operator == 'divide'  || operator == '/' ) ? $.getRandomInt(1, NumA) : $.getRandomInt(NumA, NumA + 50);
				}
				else if ( mathRound <= 5 )
				{
					var NumA		= $.getRandomInt(1,15),
						operators	= ['+', '-'];
						operator    = operators[ $.getRandomInt(0, operators.length - 1) ],
						NumB		= ( operator == 'divide'  || operator == '/' ) ? $.getRandomInt(1, NumA) : $.getRandomInt(NumA, NumA + 15);
				}

				if ( operator == 'sum' || operator == '+' )
				{
					var result = NumA + NumB;
				}
				else if ( operator == 'substract' || operator == '-' )
				{
					var result = ( NumA > NumB ) ? NumA - NumB : NumB - NumA;
				}
				else if ( operator == 'multiply' || operator == 'x' )
				{
					var result = Math.round( NumA * NumB );
				}
				else if ( operator == 'divide'  || operator == '/' )
				{
					var result = Math.round( NumA / NumB );
				}

				result = Number( result );

				if ( obfuscate === 0 )
				{
					numAObfuscated = 'obfuscate';
				}
				else if ( obfuscate === 1 )
				{
					operatorObfuscated = 'obfuscate';

				}
				else if ( obfuscate === 2 )
				{
					numBObfuscated = 'obfuscate';
				}

				var	mathBuild  = '<div id="math-build"><div class="math-group">';
					mathBuild += '<span role="numA" class="' + numAObfuscated + '">' + NumA + '</span>';
					mathBuild += '<span class="' + operatorObfuscated + '" role="operator">' + operator + '</span>';
					if ( obfuscate === 1 ) {
					
						mathBuild += '<ul id="answer-list" class="select-answer h-list"><li class="answer-option button-bigger target" data-option="+" role="answer-option">+</li><li class="answer-option button-bigger target" data-option="-" role="answer-option">-</li><li class="answer-option button-bigger target" data-option="x" role="answer-option" style="line-height: 58px;">x</li><li class="answer-option button-bigger target" data-option="/" role="answer-option">/</li></ul>';
					
					}
					mathBuild += '<span class="' + numBObfuscated + '" role="numB">' + NumB + '</span>';
					mathBuild += '<span role="result">' + result + '</span>';

					mathBuild += '</div></div>';

				$(mathBuild).appendTo(gameBody);

			break;

			case 'score':

				if ( $('#score-build')[0] )
				{
					return false;
				}

				var	scoreBuild  = '<div id="score-build"><div class="score-group">';
					scoreBuild += '<span role="score-track" class="score-track" data-total="0">0</span>';
					scoreBuild += '</div></div>';

				$(scoreBuild).prependTo(gameBody);

			break;

			case 'add-score':

				if ( !$('#score-build')[0] )
				{
					return false;
				}

				var current_score = Number( $(scoreTrack).attr('data-total') ),
					new_score	  = current_score + 1;

				if ( isNaN( new_score ) ) {
					return false;
				}

				$(scoreTrack).text( number_format( new_score ) ).attr('data-total', new_score);

			break;

			case 'substract-score':


				if ( !$('#score-build')[0] )
				{
					return false;
				}

				var current_score = Number( $(scoreTrack).attr('data-total') ),
					new_score	  = ( current_score - 1 <= 0 ) ? 0 : current_score - 1;


				if ( isNaN( new_score ) ) {
					return false;
				}

				$(scoreTrack).text( number_format( new_score ) ).attr('data-total', new_score);

			break;


			case 'answer':

				var Obj				 = options.Obj,
					flag			 = $(Obj).attr('data-flag'),
					operator		 = options.operator || $('[role="operator"]', mathBuild).text(),
					NumA			 = options.NumA || $('[role="numA"]', mathBuild).text(),
					NumB		     = options.NumB || $('[role="numB"]', mathBuild).text(),
					NumA			 = Number(NumA),
					NumB		     = Number(NumB),
					real_answer		 = Number( $('[role="result"]', mathBuild).text() );

				if ( flag ) {
					return false;
				}

				$(Obj).attr('data-flag', 1);

				$.doTimeout(400, function() {
					$(Obj).attr('remove-flag', 1);
				});

				if ( operator == 'sum' || operator == '+' )
				{
					var answer = NumA + NumB;
				}
				else if ( operator == 'substract' || operator == '-' )
				{
					var answer = ( NumA > NumB ) ? NumA - NumB : NumB - NumA;
				}
				else if ( operator == 'multiply' || operator == 'x' )
				{
					var answer = Math.round( NumA * NumB );
				}
				else if ( operator == 'divide'  || operator == '/' )
				{
					var answer = Math.round( NumA / NumB  );
				}

				if ( answer === real_answer )
				{
					$.startGame('correct');
				}
				else {
					$.startGame('wrong');
				}

			break;

			case 'correct':

				$('#math-build').remove();
				//alert('correct');

				$.startGame(game_id);
				$.startGame('add-score');

				var answerID = time	= new Date().getTime();

				var correctBuild = '<div id="answer-' + answerID + '" class="correct-answer"><i class="animated bounce"  style="background-image: url(\'' + gamePath + game_id + '/img/correct-answer.png\'); width: 225px; height: 50px; background-size: cover; display: block; animation-duration: .35s;"></i></div>';

				$(correctBuild).appendTo(gameBody);

				//$.squash({ Obj: $(teacherSeika).parent(), squashClass: 'mega-squash', from: user_id, toServer: false });

				$.playSFX('smw_correct', '#answer-' + answerID, 1, { type: 'mp3' });

				$.doTimeout(750, function() {

					$('#answer-' + answerID).find('i').removeAttr('class').animateCss('fadeOutUp', '.15s', function() {
						$(this).parent().remove();
					});
				});

			break;

			case 'wrong':

				$('#math-build').remove();
				//alert('incorrect');

				$.startGame(game_id);
				$.startGame('substract-score');

				var answerID = time	= new Date().getTime();


				var correctBuild = '<div id="answer-' + answerID + '" class="wrong-answer"><i class="animated bounce"  style="background-image: url(\'' + gamePath + game_id + '/img/wrong-answer.png\'); width: 200px; height: 95px; background-size: contain; display: block; animation-duration: .35s; background-position: "></i></div>';

				$(correctBuild).appendTo(gameBody);

				//$.squash({ Obj: $(teacherSeika).parent(), squashClass: 'mega-squash', from: user_id, toServer: false });

				$.playSFX('smw_incorrect', '#answer-' + answerID, 1, { type: 'mp3' });

				$.doTimeout(750, function() {

					$('#answer-' + answerID).find('i').removeAttr('class').animateCss('fadeOutUp', '.15s', function() {
						$(this).parent().remove();
					});
				});


			break;

			case 'finish':
				
				$(timeDownTimer).remove();

				$(answerList).remove();

				$('#math-build').remove();

				var user_featured = Number( $.user('user_featured') ),
					user_fame   = Number( $.user('user_fame') ),
					fame_points = ( user_featured ) ? 5 : 10;
				
				if ( $.user_id() > 1 )
				{
					if ( user_fame < fame_points )
					{
						$.warning({
							message: '<div class="center-text">' + $.translate('NOT_ENOUGH_FAME') + '</div><div class="center-text">' + $.translate('YOU_NEED') + ' <span class="strong">' + user_fame + ' Fame Points.</span></div>'
						});
					}
					else {
						$.startGame('submit');
					}
				}
				else {

					var current_score = Number( $('[role="score-track"]').attr('data-total') ) || 0;

					$(startScreen).show().effectCss('fadeIn');
					$('#best-scores').removeClass('hide');
					$(startGame).hide();

					var cLeft = $('[data-score="' + current_score + '"]', '#best-scores').position().left;

					$.playBGM('start', { Obj: gameBody, bgm: 'New_Eden_Town', loop: 1 });

					$('[role="final-score"]').text( number_format( current_score ) ).attr('data-total', current_score);

					//alert(cLeft);

					$.doTimeout(500, function() {

						$('#best-scores').find('nav').css({
							'transform': 'translateX(-' + cLeft + 'px)'
						});

					});

				}

			break;

			case 'submit':

				/*if ( user_id < 2 ) {

					$(startScreen).show().animateCss('1s', 'fadeIn');
					$.playBGM('start', { bgm: 'New_Eden_Town' });
					$('#score-build').remove();

					return false;
				}*/
				
				var url			  = window.url + 'play.php',
					highest_score = Number( $(HighestScoreTrack).attr('data-total') ),
					current_score = Number( $(scoreTrack).attr('data-total') ),
					param		  = {
						mode: 'score/POST',
						game_id: game_id,
						score: current_score
					};

				/*if ( current_score <= 0 ) {

					$(startScreen).show().animateCss('1s', 'fadeIn');
					$.playBGM('start', { bgm: 'New_Eden_Town' });
					$('#score-build').remove();

					return false;
				}*/

				$.slowLoad('start');

				$.post(url, param).done(function(data) {
					
					//console.log(data);

					if ( data && current_score > 0 )
					{
						$.notification({ 
							message: data, 
							duration: 2000
						});
					}
					

				}).always(function() {
				
					$.slowLoad('stop');
					$(startScreen).show().effectCss('fadeIn');
					$('#best-scores').removeClass('hide');
					$(startGame).hide();

					var cLeft = $('[data-score="' + current_score + '"]', '#best-scores').position().left;

					if ( highest_score < current_score ) {
						$(HighestScoreTrack).text( number_format( current_score ) ).attr('data-total', current_score);
					}

					$.playBGM('start', { Obj: gameBody, bgm: 'New_Eden_Town', loop: 1 });

					$('[role="final-score"]').text( number_format( current_score ) ).attr('data-total', current_score);

					$('#score-build').remove();

					$.doTimeout(500, function() {

						$('#best-scores').find('nav').css({
							'transform': 'translateX(-' + cLeft + 'px)'
						});

					});

				});

			break;


			default:

				//var	pop = $.pop('user-avatar', user_id);
				$.doTimeout(1000, function() {
					$.playBGM('start', { Obj: gameBody, bgm: 'New_Eden_Town', loop: 1 });
				});

				$(startGame).removeClass('noAlpha').animateCss('1s', 'fadeIn', function() {
					
					
				
				});

			break;
		}
	
	};

	$.startGame();

});