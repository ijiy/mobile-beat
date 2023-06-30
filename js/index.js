var isTouch = "ontouchstart" in window;

function eventType(a) {
	if (!isTouch) {
		switch (a) {
			case "touchstart":
				return "mousedown";
			case "touchend":
				return "mouseup";
			case "touchmove":
				return "mousemove";
		}
	}
}

function addEvent(a, b, c) {
	a.addEventListener(eventType(b) || b, c);
}

function getTouch(a) {
	return isTouch ? a.changedTouches[0] : a;
}

function hasClass(a, b) {
	return (" " + a.className + " ").match(" " + b + " ") ? 1 : 0;
}

function addClass(a, b) {
	hasClass(a, b) || (a.className += a.className ? " " + b : b);
}

function removeClass(a, b) {
	a.className = (" " + a.className + " ")
		.replace(" " + b + " ", " ")
		.replace(/(^\s*)|(\s*$)/g, "");
}

function ajax(a, b, c, d, g) {
	var e = new XMLHttpRequest,
		h = null;

	e.onreadystatechange = function() {
		e.readyState === 4 && (200 <= e.status && 300 > e.status || e.status === 304) ? d && d(e.responseText) : g && g(e.responseText)
	};

	if (c) {
		if (/get/gi.test(a)) {
			for (var k = "?", f = 0; f < c.length; f++) {
				b += k + c[f][0] + "=" + c[f][1];
				k = "&";
			}
		} else {
			for (h = new FormData, f = 0; f < c.length; f++) {
				h.append(c[f][0], c[f][1]);
			}
		}
	}

	e.open(a, b);
	e.send(h)
}
Date.now || (Date.now = function() {
	return (new Date)
		.getTime()
});
(function() {
	window.requestAnimationFrame || (window.requestAnimationFrame = window.webkitRequestAnimationFrame, window.cancelAnimationFrame = window.webkitCancelAnimationFrame || window.webkitCancelRequestAnimationFrame);
	if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) || !window.requestAnimationFrame || !window.cancelAnimationFrame) {
		var a = 0;
		window.requestAnimationFrame = function(b) {
			var c = Date.now(),
				d = Math.max(a + 16, c);
			return setTimeout(function() {
				b(a = d)
			}, d - c)
		};
		window.cancelAnimationFrame = clearTimeout
	}
})();

function getStyle(a, b) {
	return parseFloat(a.currentStyle ? a.currentStyle[b] : getComputedStyle(a)[b])
}

function imgLoad(a, b) {
	document.all ? a.onreadystatechange = function() {
		"loaded" != a.readyState && "complete" != a.readyState || b()
	} : a.onload = b
}

function formatNum(a) {
	return 10 > a ? "0" + parseInt(a) : parseInt(a)
}

function css(a) {
	return "-webkit-" + a + a
}

function $(a, b) {
	var c = (b ? b : document)
		.querySelectorAll(a);
	return 1 < c.length ? c : c[0]
}

function each(a, b) {
	a = a || 0;
	for (var c = a.length, d = c || parseInt(a) || 1, g = 0; g < d; g++) b(c ? a[g] : 1 < d ? g : a, g, a ? d : 0)
}

var body = $("body", html),
	wrap = $(".wrap", html),
	load = $(".load", html),
	tip = $(".tip", html),
	dialog = $(".dialog", html),
	load_span = $("span", load),
	wraps = {
		touch: $(".touch", wrap),
		pass0: $(".pass .p0", wrap),
		pass1: $(".pass .p1", wrap),
		field: $(".field", wrap)
	},
	fields = {
		role: $(".role", wraps.field),
		hero: $(".hero", wraps.field),
		tzmw: $(".tzmw", wraps.field),
		hurt: $(".hurt", wraps.field),
		board: $(".board", wraps.field)
	},
	boards = {
		gold: $(".gold", fields.board),
		timer: $(".timer", fields.board),
		name: $(".role-name", fields.board),
		pro: $(".hp-pro span",
			fields.board)[1],
		hp: $(".role-hp", fields.board)
	},
	timer_timer = timer_role_delay = timer_tzmw = timer_tip = null,
	timer_time = 3E4,
	tzmw_object = {},
	hero_object = {},
	role_object = {},
	role_list = [];

function touchFix(a, b) {
	var c = getTouch(b),
		e = a.getBoundingClientRect(),
		d = c.pageX - e.left;

	c = c.pageY - e.top;

	return 0 > d || d > getStyle(a, "width") || 0 > c || c > getStyle(a, "height") ? !1 : !0
}

function timerTime(a) {
	var b = timer_time - (new Date - a);
	0 < b ? (timer_timer = requestAnimationFrame(function() {
		timerTime(a)
	}), boards.timer.innerHTML = formatTime(b)) : (b = 0, boards.timer.innerHTML = 0, tzmw_object.mw = 0, changeRole())
}
var timer_hero_class = null,
	timer_hero_delay = null,
	timer_hero_crit = null,
	timer_role_alive = null;

function roleAttacked() {
	role_object.click = 0;

	var a = hero_object.atc,
		b = document.createElement("i");

	hero_object.critRate && !Math.floor(1 / hero_object.critRate * Math.random()) && (a *= hero_object.critDmg, clearTimeout(timer_hero_crit), removeClass(wrap, "crit"), addClass(b, "scale"), requestAnimationFrame(function() {
		addClass(wrap, "crit");
		timer_hero_crit = setTimeout(function() {
			removeClass(wrap, "crit")
		}, 400)
	}));

	b.innerHTML = a.toFixed(2);
	fields.hurt.appendChild(b);

	each(fields.hurt.querySelectorAll("i"), function(a, b, d) {
		10 < d && 5 > b && a.parentNode.removeChild(a);
	});

	role_object.hp -= a;
	a = role_object.hp / role_object.hps;
	boards.hp.innerHTML = role_object.hp;
	boards.pro.nextElementSibling.style.cssText = css("transform: translate3d(-" + (2.44 - 2.43 * a) + "rem, 0, 0);");
	boards.pro.style.cssText = css("transform: scale(" + a + ", 1);");
	timer_hero_class || (clearTimeout(timer_hero_delay), timer_hero_delay = setTimeout(function() {
			fields.hero.className = "hero"
		}, 1200), hasClass(fields.hero, "atc-1") ? heroAtc("atc-2") : hasClass(fields.hero, "atc-2") ? heroAtc("atc-3") :
		heroAtc("atc-1"), timer_hero_class = setTimeout(function() {
			timer_hero_class = null
		}, 250));
	removeClass(fields.role, "alive");
	removeClass(fields.role, "attacked");
	a < 2 / 3 && addClass(fields.role, "attacked-1");
	a < 1 / 3 && addClass(fields.role, "attacked-2");
	if (0 >= role_object.hp) return roleDie(), !1;
	roleAtc(new Date)
}

function roleAtc(a) {
	70 > new Date - a ? requestAnimationFrame(function() {
		roleAtc(a)
	}) : (addClass(fields.role, "attacked"), role_object.click = 1, clearTimeout(timer_role_alive), timer_role_alive = setTimeout(function() {
		removeClass(fields.role, "attacked");
		setTimeout(function() {
			addClass(fields.role, "alive")
		}, 300)
	}, 600))
}

function heroAtc(a) {
	fields.hero.className = "hero";

	requestAnimationFrame(function() {
		addClass(fields.hero, a)
	})
}

function roleDie() {
	hero_object.gold += role_object.gold;
	boards.gold.innerHTML = hero_object.gold;
	tzmw_object.mw ? (tzmw_object.mw = hero_object.mw = hero_object.passSingle = 0, hero_object.passTotal++, hero_object.atc += 5 * hero_object.passTotal, hero_object.critDmg += .2, hero_object.critRate += .02) : hero_object.mw || (hero_object.passSingle++, hero_object.passSingle === hero_object.passMax && (hero_object.mw = 1));
	addClass(fields.role, "die");
	boards.hp.innerHTML = 0;
	boards.pro.parentNode.style.display = "none";
	dieBack();
	changeRole()
}

function changeRole() {
	role_object = {};
	clearTimeout(timer_role_delay);
	cancelAnimationFrame(timer_timer);
	var a = "opacity: " + (Math.floor(10 * Math.random()) ? 1 : .5) + ";";
	fields.role.style.cssText = "opacity: 0;" + css("transition: opacity .3s linear, transform .3s linear;");
	wraps.pass0.style.backgroundPosition = ".15rem -" + .6 * (hero_object.passSingle + 1) + "rem";
	fields.tzmw.style.display = hero_object.mw ? "block" : "none";
	boards.timer.innerHTML = formatTime(timer_time);
	tzmw_object.mw ? (boards.timer.style.display = "block", fields.tzmw.children[0].style.display =
		"none") : (boards.timer.style.display = "none", fields.tzmw.children[0].style.display = "block");
	boards.timer.style.display = tzmw_object.mw ? "block" : "none";
	setTimeout(function() {
		fields.role.className = "role";
		fields.hero.className = "hero";
		requestAnimationFrame(function() {
			var b = Math.floor(Math.random() * role_list.length),
				c = role_list[b],
				d = c.hp + 50 * (hero_object.passTotal * hero_object.passMax + hero_object.passSingle),
				e = tzmw_object.hp + 1E3 * hero_object.passTotal,
				f = 1 > hero_object.passTotal ? tzmw_object.gold + Math.floor(40 *
					Math.random()) : 2,
				g = 1 > hero_object.passTotal && hero_object.passSingle < hero_object.passMax ? c.gold + Math.floor(5 * Math.random()) : 1;
			role_object = {
				name: (tzmw_object.mw ? "\u9b54\u738b:" : "") + c.name,
				hps: tzmw_object.mw ? e : d,
				hp: tzmw_object.mw ? e : d,
				golds: tzmw_object.mw ? f : g,
				gold: tzmw_object.mw ? f : g,
				index: b,
				click: 1
			};

			boards.name.innerHTML = role_object.name;
			boards.hp.innerHTML = role_object.hp;
			boards.pro.parentNode.style.display = "block";
			boards.pro.nextElementSibling.style.cssText = css("transform: translate3d(0, 0, 0);");
			boards.pro.style.cssText = css("transform: scale(1);");
			fields.role.id = "role_" + b;
			addClass(fields.role, "role-" + b + " alive" + (tzmw_object.mw ? " mw" : ""));
			fields.role.style.cssText = a + css("transition: opacity .2s linear;");
			tzmw_object.mw && timerTime(new Date);
			role_object.click = 1;
			timer_role_delay = setTimeout(function() {
				fields.role.style.cssText = a;
			}, 200)
		})
	}, 300)
}

function formatTime(a) {
	return formatNum(a / 1E3) + ":" + parseInt(a % 1E3 / 100);
}

var load_text = 0,
	load_width = getStyle(load_span.parentNode, "width");

(function(d) {
	var a = [],
		c = [];

	each(d, function(b) {
		var a = new Image;
		a.src = IMGURL + "images/" + b;
		c.push(a)
	});

	each(c, function(b) {
		imgLoad(b, function() {
			a.push(b);
			load_text = a.length / c.length;
			load_span.style.width = load_text * load_width + "px"
		})
	});
})("bg.jpg gold.png tzmw.png gold.png effect.png hero.png pass3.png tie.png touch.png hand.png submit.png 01/dun-1.png 01/dun-2.png 01/dun-3.png 01/shen.png 01/tou.png 01/toukui.png 01/yan.png 01/yshou.png 01/zshou.png 02/biyan.png 02/yanzhu.png 02/yer.png 02/zer.png 02/shen.png 02/tou.png 02/yshou.png 02/zshou.png 03/biyan.png 03/bizui.png 03/jiao.png 03/ychi.png 03/zchi.png 03/zhangzui.png 03/zhengyan.png 03/shen.png 03/yshou.png 03/zshou.png 04/huo-1.png 04/huo-2.png 04/huo-3.png 04/shuzhier.png 04/shuzhiyi.png 04/ybi.png 04/zbi.png 04/shen.png 04/yshou.png 04/zshou.png".split(" "));

var timer_dialog = null;

function showDialog(a) {
	if (!timer_dialog) {
		hero_object.click = 0;
		var b = $("." + a, dialog);
		dialog.style.cssText = "background: rgba(0, 0, 0, .5);";
		b.style.cssText = "opacity: 1;" + css("transform: translate3d(0, 0, 0);");
		timer_dialog = setTimeout(function() {
			timer_dialog = null;
			dialog.style.cssText += "pointer-events: auto;";
			b.style.cssText += "pointer-events: auto;"
		}, 800)
	}
}
addEvent(dialog.children[0], "touchstart", function(a) {
	a.stopPropagation()
});

function loadFix() {
	1 > load_text ? requestAnimationFrame(loadFix) : (heroData(), boards.gold.innerHTML = hero_object.gold, wraps.pass1.style.backgroundPosition = ".15rem -" + .6 * (hero_object.passMax + 1) + "rem", load.style.opacity = "0", changeRole(), setTimeout(function() {
		addClass(html, "init");
		setTimeout(function() {
			load.style.display = "none";
			hero_object.click || alert("\u6d3b\u52a8\u7ef4\u62a4\u4e2d...");
			addEvent(wrap, "touchend", function(a) {
				role_object.click && hero_object.click && (roleAttacked(), a = getTouch(a), wraps.touch.style.cssText =
					"display: block; top: " + a.pageY + "px; left: " + (a.pageX - body.getBoundingClientRect()
						.left) + "px;", removeClass(wraps.touch, "touch-atc"), requestAnimationFrame(function() {
						requestAnimationFrame(function() {
							addClass(wraps.touch, "touch-atc")
						})
					}))
			});

			addEvent(fields.tzmw, "touchend", function(a) {
				a.stopPropagation();
				if (!touchFix(this, a)) return !1;
				tzmw_object.mw = !tzmw_object.mw;
				changeRole()
			})
		}, 100)
	}, 300))
}
window.onload = loadFix;
