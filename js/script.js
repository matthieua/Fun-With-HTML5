Experimentation = {
	yqlQuery: "http://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20xml%20where%20url%3D%22XMLURL%22&format=json&callback=?",
	init: function() {
		this.initNav();
		this.dragAndDrop.init();
		this.twitterSection.init();
		this.flickrSection.init();
		this.facebookSection.init();
		this.newsSection.init();
		this.welcomeStorage.init();		
	},
	
	initNav: function() {
		var $c =  $('#home'), //current section
			$l = $('#home'), //flint logo
			$s, // section selected
			sRel = '', // selected rel atribute
			$logo = $('#flint-logo'),
			$header = $('header'),
			$nav = $('nav'), // nav
			cX = cY = difX = difY = time = 0, //calculation variables
			homeLinkId = 'home-link',
			sections = ['twitter', 'news', 'flickr', 'facebook', 'home'];
			colors= new Array();

		$('nav a#special').click(function() {
			var $this = $(this);
			activeNavLink($this);
			$s = $('section#home');
			showS(animateL);
		}) ;
		
		$('a.section-link').click(function() {
			var $this = $(this);
			$(this).blur();
			if (!$this.hasClass('active') && (!$this.attr('data-related-link') != 'special')) {
				activeNavLink($this);
				sRel = $this.attr('data-related-link');
				//get the selected section id
				$s = $('section#' + sRel.replace('-link', ''));		
				//hide the current section and show the selected one
				showS();
				//activate the footer link
				desactivateFooterLinks(500);
				activeFooterLink(1000, sRel);
			}
		});


		initColorsArray();
		
		//init the flint logo links hover effects
		$('a', $logo).hover(function() {
			$('.element',this).animate({ backgroundColor: colors[$(this).attr('id')] }, 400);
		},function() {
			$('.element',this).animate({ backgroundColor: "#fff" }, 300);
		});
		
		//init the hover footer links effects
		$('a', 'footer').hover(function() {
			 activeFooterLink(300, $(this).attr('class'));
		}, function() {
			desactivateFooterLinks(300,$(this));
		});

		//handle the nav
		function activeNavLink($link) {
			$('a', $nav).removeClass('active');
			//add active class to the link
			$link.addClass('active');
		}
		
		//handle the footer
		function activeFooterLink(duration, className) {
			var $link = $('a.' + className, 'footer');
			//change opacity and bg color on active link
			if ($link.length) 	$link.animate({opacity: 1, backgroundColor: colors[className]}, duration).parent().addClass('active');
		}
		
		function desactivateFooterLinks(duration, $l) {
			var $link = ($l)? $l : $('li.active a', 'footer'),
				defaultBgColor = '#6C7279';
			//remove opacity on active link
			if ($link.length && (sRel != $link.attr('class'))) 	$link.animate({opacity: 0.3, backgroundColor: defaultBgColor}, duration).parent().removeClass('active');
		}

		function animateL() {
			$header.data('originalHeight', $header.height()).find('a').fadeOut('fast');
				$header.animate({height: 0}, 500, function() {
					showEverySection(0, function(){
						rotateLogo(0,function(){
							$header.animate({height: $header.data('originalHeight')}, 500, function(){
								$(this).find('a').fadeIn('fast');
							});	
						});
					});
				});
		}
		
		function showEverySection(i, callback) {
			if (i<(sections.length )) {
				$s = $('section#' + sections[i]);
				showS(function() {
					setTimeout(function(){
							showEverySection((i+1), callback);
						}, 1000);
				});
			}
			else {
				callback.call();
			}
		}
		
		function rotateLogo(i, callback) {
			if (i<(colors.length )) {
					$logo.animate({backgroundColor: colors[i], rotate: '+=360deg'}, 1000, function() {
					rotateLogo((i+1), callback);
				});	
			} else {
				callback.call();
			}
		}

		// show the selected section
		function showS(callback) {
					
			var flag = false;
			cX = $s.offset().left;
			cY = $s.offset().top;
			time = (Math.abs(cX) + Math.abs(cY)) / 1.4;
			$('section').each(function() {
				$this = $(this);
				difX = $this.offset().left - cX;
				difY = $this.offset().top - cY;
				$this.animate({left: difX, top: difY}, {duration: time, easing: 'easeOutExpo', complete: function() {
						if ((callback != undefined) && (flag == false)) {
							callback.call();
							flag = true;
						}
				}}); 
			});	
			//change the url
			if (Modernizr.history) window.history.pushState(null, $s.attr('id'), $s.attr('id'));
			//the current becomes the selected one
			$c = $s;
		}

		function resetCoordinates() {
			cX = cY = 0;
		}
		
		function initColorsArray() {
			//inialise the colors array 
			colors[0] = colors['twitter-link'] = colors['first-element'] = '#3dc7f4';
			colors[1] = colors['news-link'] = colors['second-element'] = '#FF7B00';
			colors[2] = colors['flickr-link'] = colors['third-element'] = '#FF007F';
			colors[3] = colors['facebook-link'] = colors['fourth-element'] = '#2D569C';
			colors[4] = colors['default'] = '#D30020';
		}
	},
	dragAndDrop: {
		init: function() {
			if (Modernizr.draganddrop) {
				var $context = $('#home'),
					$logo = $("#flint-logo", $context),
					$logoLinks = $('a', $logo),
					text;
				$('*[draggable=true]', $context).draggable(
				    function() {
				        return {
				            effect: 'move',
							'id': $(this).attr('id'),
							'text': $(this).html()
				        }
				    },
				    function() {
						// callback
				    }
				)
				// Events container
	        	$logo.droppable(
		            'id',
		            // Drag enter
		            function() {
		                
						$(this).css('opacity','0.5');
		            },
            
		            // Drag leave
		            function() {
						$(this).css('opacity','1');
		            },
            
		            // Drop!
		            function(e) {
						$logoLinks.hide();
						$('#'  + e.dataTransfer.getData('id'), $context).hide();
						text = e.dataTransfer.getData('text');
						if ($('p', $logo).length) {
							$('p', $logo).html(text);
						} else {
							$('<p />').appendTo($logo).css('opacity', '0').html(text);	
						}
						// $logoLinks.hide();
						$('p', $logo).animate({opacity: 1}, 500, function() {
							setTimeout(function() {
								$('p', $logo).animate({opacity:0}, 500, function() {				
									$logoLinks.fadeIn();
								});
							}, 1000);

						});
		            }
		        )
			}
		}
	},
	
	twitterSection: {
		init: function() {
			Experimentation.utils.getJsonOject('http://api.twitter.com/1/statuses/user_timeline.json?screen_name=flint_tweets&callback=?', Experimentation.twitterSection.show);						 
		},
		
		show: function(tweets) {
			var $section = $('section#twitter');
			if (tweets.length > 0) {
				//show profile picture
				// if (tweets[0].user.profile_image_url) $section.prepend('<div id="twitter-profile-image"><img src="' + tweets[0].user.profile_image_url +'"/></div>')
				$('<ul />').appendTo($section);
				$.each(tweets, function(i, tweet) {
					// console.log(tweet);
					$section.find('ul').append('<li>' 
									   + Experimentation.utils.formatTweet(tweet.text) + ' '
					 			       + '<span class="time"> - ' + Experimentation.utils.relative_time(tweet.created_at)+'</span>' + ' '
					 				   + '</li>');
				});
				//initialise the infinite scrolling
				$("ul", $section).simplyScroll({autoMode: 'loop',className: 'vert',	horizontal: false,	speed: 1});
				
			} else {
				$section.append('could not load the tweets, please refresh');
			}
		}
	},
	
	flickrSection: {
		init: function() {
			Experimentation.utils.getJsonOject('http://api.flickr.com/services/feeds/photos_public.gne?format=json&id=14531708@N04&jsoncallback=?', Experimentation.flickrSection.show);
			this.initKodakStack();
		},
		show: function(o) {
			var $section = $('section#flickr'),
				photos = [];
			if (o.items.length > 0) {
				$('<ul />').appendTo($section).addClass('simpleScroll');
				$.each(o.items, function(i, item) {
						photos.push('<li><a href="#" class="flickr-photo"><img src="' + item.media.m + '"/></a>');
				});
				$section.find('ul.simpleScroll').append(photos.join(''));
			// initialise the infinite scrolling
			$("ul.simpleScroll", $section).simplyScroll({autoMode: 'loop',className: 'flickr',frameRate: 20,	speed: 2
			});
			} else {
				$section.append('could not load the images, please refresh');
			}
		},
		initKodakStack: function() {
			var $section = $('section#flickr'),
				$photos = $('a.flickr-photo', $section),
				$stack = $('#stack ul', $section),
				$last, left = 0;
				
			$photos.live('click',function() {
				var $this = $(this);
				if (!($this.hasClass('stacked'))) {
					$this.addClass('stacked');
					$stack.append('<li><img src="' + $('img',$this).attr('src') + '"  /></li>');	
					$last = $('li',$stack).last().css('left', left);
					width = $last.find('img').first().width();
					$last.append('<div contenteditable="true" style="width:' + width + 'px;"><span>Enter the title here</span></div><a href="#" class="rotate-lk"></a>');
					left += width - 10;	
				}
				return false;
			});
			
			$('li', $stack).live('click',function() {
				$(this).css('z-index', '2').siblings().css('z-index', '1');
			});
			
			$('li', $stack).live('mouseover',function() {
				$(this).find('.rotate-lk').fadeIn();
				
			});
			$('li', $stack).live('mouseleave', function() {
				$(this).find('.rotate-lk').fadeOut();
			});
			
			$('a.rotate-lk', $stack).live('click', function() {
				$(this).blur().parent().animate({rotate: '-=45deg'}, 300);
			});
			
			$('li', $stack).live('dblclick',function() {
				if ($(this).hasClass('dblClick')) {
					$(this).removeClass('dblClick');
				} else {
					$(this).addClass('dblClick');
				}
			});
			
		}
		
	},
	
	facebookSection: {
		init: function() {
			Experimentation.utils.getJsonOject('https://graph.facebook.com/138834225895/posts?fields=message&callback=?', Experimentation.facebookSection.show);
		},
		show: function(o) {
			var $section = $('section#facebook'),
				fbLink = 'http://www.facebook.com/permalink.php?story_fbid=125655094164432&id=138834225895#!/pages/Flint/138834225895?v=wall'
			if (o.data.length > 0) {
				$('<ul />').appendTo($section);
				$.each(o.data, function(i,item) {
					if(item.message) {
						$section.find('ul').append('<li>' 
										   + '<a href="' + fbLink + '" title="Facebook Update" target="_blank">' + item.message + ' &raquo;</a><br />'
										   + '<span class="time">Posted: ' + Experimentation.utils.format_facebook_date(item.created_time) + '</span>'
						 				   + '</li>');
					}
				});
				// initialise the infinite scrolling
				$("ul", $section).simplyScroll({autoMode: 'loop',className: 'vert',	horizontal: false,	speed: 1});
			} else {
				$section.append('could not load the updates, please refresh');
			}
		}
		

	},	
	newsSection: {
		init: function() {
			Experimentation.utils.getJsonOject('http://blog.flintinteractive.com.au/feed/', Experimentation.newsSection.show, true);
		},
		show: function(o) {
			var results = o.query.results.rss.channel.item,
				$section = $('section#news');
			if (results.length > 0) {
				$('<ul />').appendTo($section);
				
				$.each(results, function(i,item) {
						$section.find('ul').append('<li>' 
										   + '<a href="' + item.link + '" title="'+ item.title + '"target="_blank">' + item.title + ' &raquo;</a><br />'
										   + '<span class="time">Published: ' + Experimentation.utils.format_date(item.pubDate) + '</span>'
						 				   + '</li>');
				}); 
				// initialise the infinite scrolling
				$("ul", $section).simplyScroll({autoMode: 'loop',className: 'vert',	horizontal: false,	speed: 1});
			} else {
					$section.append('could not load the news, please refresh');
			}
		}
	},
	
	//store the welcome value in local storage value
	welcomeStorage: {
		init: function() {
			var $welcome = $('#welcome', '#home'),
				welcomeVarName = 'welcomeMessage',
				welcomeVarContent = localStorage.getItem(welcomeVarName);
			if (typeof(localStorage) != undefined ) {
				if (localStorage.getItem(welcomeVarName)) $welcome.text(welcomeVarContent);
				$welcome.bind('keyup keydown blur change', function() {
					localStorage.setItem(welcomeVarName, $welcome.text());
				});
			}	
		}
	},
	
	utils : {
		formatTweet: function(text) {
			var urlRegex = /((ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?)/gi,
				userRegex = /[\@]+([A-Za-z0-9-_]+)/gi,
				hashRegex = / [\#]+([A-Za-z0-9-_]+)/gi;
			
			text = text.replace(urlRegex,"<a href=\"$1\">$1</a>");
			text = text.replace(userRegex,"<a class=\"tweet-user-link\" href=\"http://twitter.com/$1\"><span>@</span>$1</a>");
			text = text.replace(hashRegex, ' <a href="http://search.twitter.com/search?q=&tag=$1&lang=all&from=flint_tweets">#$1</a>');
			return(text);
		},
	  relative_time: function(time_value) {
	      var parsed_date = this.parse_date(time_value);
	      var relative_to = (arguments.length > 1) ? arguments[1] : new Date();
	      var delta = parseInt((relative_to.getTime() - parsed_date) / 1000);
	      var pluralize = function (singular, n) {
	        return '' + n + ' ' + singular + (n == 1 ? '' : 's');
	      };
	      if(delta < 60) {
	      return 'less than a minute ago';
	      } else if(delta < (60*60)) {
	      return 'about ' + pluralize("minute", parseInt(delta / 60)) + ' ago';
	      } else if(delta < (24*60*60)) {
	      return 'about ' + pluralize("hour", parseInt(delta / 3600)) + ' ago';
	      } else {
	      return 'about ' + pluralize("day", parseInt(delta / 86400)) + ' ago';
	      }
	    },

		format_date: function(date_value) {
			var d = date_value.substr(0,16),
				monthNames = new Array();
				monthNames["Jan"] = "January";
				monthNames["Feb"] = "February";
				monthNames["Mar"] = "March";
				monthNames["Apr"] = "April";
				monthNames["May"] = "May";
				monthNames["Jun"] = "June";
				monthNames["Jul"] = "July";
				monthNames["Aug"] = "August";
				monthNames["Sep"] = "September";
				monthNames["Oct"] = "October";
				monthNames["Nov"] = "November";
				monthNames["Dec"] = "December";
			
				date_formated = d.substr(5,2) + ' ' + monthNames[d.substr(8,3)] + ', ' + d.substr(12,4);
		
			return (date_formated);
		},
	
		format_facebook_date: function(date_value) {
		
			var d = date_value.substr(0,10),
				monthNames = [ "January", "February", "March", "April", "May", "June",
				    "July", "August", "September", "October", "November", "December" ],
				date_formated = d.substr(8,2) + ' ' + monthNames[(d.substr(5,2) - 1)] + ', ' + d.substr(0,4);
			return(date_formated);
		},
	
	  	parse_date: function(date_str) {
	      // The non-search twitter APIs return inconsistently-formatted dates, which Date.parse
	      // cannot handle in IE. We therefore perform the following transformation:
	      // "Wed Apr 29 08:53:31 +0000 2009" => "Wed, Apr 29 2009 08:53:31 +0000"
	      return Date.parse(date_str.replace(/^([a-z]{3})( [a-z]{3} \d\d?)(.*)( \d{4})$/i, '$1,$2$4$3'));
	    },
		getJsonOject: function(url, callback, yql) {
			var query;
			(yql != undefined) ? (query =  Experimentation.yqlQuery.replace('XMLURL',url)) : (query = url);
			$.getJSON(query, function(o) {
				callback.call(this, o);
			})
		}
	}
}

$('document').ready(function() {
	Experimentation.init();
});

