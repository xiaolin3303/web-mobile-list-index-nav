function vIndexNav (opts) {
	opts = opts || {};
	this.opts = $.extend({
		onNav: function () {}
	}, opts);

	if (!opts.target) {
		throw new Error ('target param is required!');
	}

	this.targetWrapper = opts.target;
	this.lock = false;
	this.indexList = [];
	this.tipTimer = null;
	this.prevIndex = null;

	this.init();
}

vIndexNav.prototype.init = function () {
	this.render();
	var list = this.collectIndex();
	this.renderIndexList(list);
	this.getIndexDetail();
	this.bind();
}

vIndexNav.prototype.render = function () {
	var navTpl = '<div><ul></ul></div>';
	this.navWrapper = $(navTpl);
	this.navWrapper.addClass('v-index-nav');
	$('body').append(this.navWrapper);

	var tipTpl = '<div></div>';
	this.tipWrapper = $(tipTpl);
	this.tipWrapper.addClass('v-nav-index-tip');
	$('body').append(this.tipWrapper);
}

vIndexNav.prototype.collectIndex = function () {
	var list = []
	var targets = this.targetWrapper.find('[v-nav-index]');
	targets.each(function () {
		list.push($(this).attr('v-nav-index'));
	});

	return list;
}

vIndexNav.prototype.getIndexDetail = function () {
	var me = this;
	$('ul > li', this.navWrapper).each(function () {
		var item = {}
		item.index = $(this).text();
		item.position = $(this).offset().top - window.scrollY;
		item.height = $(this).height();

		me.indexList.push(item);
	});
}

vIndexNav.prototype.renderIndexList = function (list) {
	var tpl = [];
	list.forEach(function (item) {
		tpl.push('<li>' + item + '</li>');
	});

	$('ul', this.navWrapper).html(tpl.join(''));
}

vIndexNav.prototype.findIndex = function (pos) {
	var target = null;
	for(var i = 0, len = this.indexList.length; i < len; i++) {
		var item = this.indexList[i];
		var start = item.position;
		var end = start + item.height;
		if (pos >= start && pos <= end) {
			target = item;
			break;
		}
	}

	return target;
}

vIndexNav.prototype.showIndexTip = function (index) {
	if (this.tipTimer) {
		clearTimeout(this.tipTimer);
	}

	$('.v-nav-index-tip').text(index).show();
	this.tipTimer = setTimeout(function () {
		$('.v-nav-index-tip').hide();
	}, 1000);
}

vIndexNav.prototype.moveTo = function (index) {
	var target = $('[v-nav-index]', this.targetWrapper).filter(function () {
		return $(this).attr('v-nav-index') === index;
	});

	if (target) {
		var top = target.offset().top;
		window.scrollTo(0, top);
	}
}

vIndexNav.prototype.nav = function (pos) {
	pos = pos - window.scrollY;
	var indexItem = this.findIndex(pos);
	if (indexItem && indexItem.index !== this.prevIndex) {
		this.prevIndex = indexItem.index;
		this.showIndexTip(indexItem.index);
		this.moveTo(indexItem.index);

		this.opts.onNav(indexItem.index);
	}
}

vIndexNav.prototype.bind = function () {
	var me = this;
	this.navWrapper.on('touchmove', function (e) {
		this.lock && e.preventDefault();
		me.nav(e.touches[0].pageY);
	});
	this.navWrapper.on('touchstart', function (e) {
		this.lock = true;
		me.nav(e.touches[0].pageY);
	});
	this.navWrapper.on('touchend', function (e) {
		this.lock = false;
	});
}