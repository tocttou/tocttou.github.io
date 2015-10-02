$( document ).ready(function() {

	var fire_base = new Firebase('https://ashish-blog.firebaseio.com/');

	$(function() {
		$('#rating').barrating({
			theme: 'bars-movie',
			initialRating: "mediocre"
		});
		$('#message').val('');
		$('#rating').val("mediocre");
	});

	if ($.ui) {
	    (function () {
	        var oldEffect = $.fn.effect;
	        $.fn.effect = function (effectName) {
	            if (effectName === "shake") {
	                var old = $.effects.createWrapper;
	                $.effects.createWrapper = function (element) {
	                    var result;
	                    var oldCSS = $.fn.css;

	                    $.fn.css = function (size) {
	                        var _element = this;
	                        var hasOwn = Object.prototype.hasOwnProperty;
	                        return _element === element && hasOwn.call(size, "width") && hasOwn.call(size, "height") && _element || oldCSS.apply(this, arguments);
	                    };

	                    result = old.apply(this, arguments);

	                    $.fn.css = oldCSS;
	                    return result;
	                };
	            }
	            return oldEffect.apply(this, arguments);
	        };
	    })();
	}

	$("#message").focus(function(){
		$("#message").css("border", "2px solid #008a3c");
	});

	$("#message").focusout(function(){
		$("#message").css("border", "2px dashed #008a3c");
	});

	$("#sendbutton").click(function(){
		if($.trim($("#message").val())==''){
			$("#message").css("border", "2px dashed #ff0000");
			$("#message").effect("shake");
		}
		else{
			var article_rating = $("#rating").val();
			var article_message = $("#message").val();

			$("#sendbutton").hide();
			$(".spinner").show();

			var imagetoshow = {};

			var base_url = window.location.origin;

			imagetoshow["err"] = base_url.concat("/images/site/error.svg");
			imagetoshow["bad"] = base_url.concat("/images/site/bad.svg");
			imagetoshow["mediocre"] = base_url.concat("/images/site/mediocre.svg");
			imagetoshow["good"] = base_url.concat("/images/site/good.svg");
			imagetoshow["awesome"] = base_url.concat("/images/site/awesome.svg");

			var onComplete = function(error) {
				if (error) {
					$("#status").attr("src", imagetoshow["err"]);
				} else {
					$("#status").attr("src", imagetoshow[article_rating]);
					$("#message").val('');
				}
				$(".spinner").hide();
				$("#status").css("margin", "auto");
				$("#status").css("display", "inline-block");
			};

			fire_base.push({rating: article_rating, message: article_message}, onComplete);
		}
	});

});