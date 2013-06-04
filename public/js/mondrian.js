/**
 * Mondrian.js
 * A library for generating random colours in JavaScript
 * By Joe Pettersson / joepettersson.com/mondrian/ github.com/JoePettersson/mondrian
 *
 * Usage:
 * Mondrian returns random color values in four different formats (but always returned as a string), 
 * two of those formats also allow for the setting of either a random transparency value or one 
 * supplied, they are:
 *
 * - rgb (allows transparency)
 * 	 Example:
 * 	 	Mondrian.init('rgb'); // rgb(89,16,115)
 * 	 	Mondrian.init('rgb', true); // rgba(89,16,115,88)
 * 	 	Mondrian.init('rgb', 20); // rgba(89,16,115,20)
 * - colorName
 * 	 Example:
 * 	 	Mondrian.init('colorName'); // Blue
 * - hex
 * 	 Example:
 * 	 	Mondrian.init('hex'); // #26a5a7
 * - hsl (allows transparency)
 * 	 Example:
 * 	 	Mondrian.init('hsl'); // hsl(29,98%,6%)
 * 	 	Mondrian.init('hsl', true); // hsla(11,38%,82%,13)
 * 	 	Mondrian.init('hsl', 20); // hsla(11,38%,82%,20)
 *
 * Note: rendering a color with alpha transparency is only supported in browsers who support CSS3
 */
var Mondrian = {

	/**
	 * The Mondrian constructor
	 * @param  {String} format       A string representing the type of format the random colour should be returned in
	 * @param  {Boolean} transparency A boolean representing whether the random colour should be returned with a random or user defined transparency
	 * @return {String}              A random color
	 */
	init: function (format, transparency) {
		'use strict';
		var self = this;

		self.options = {
			availableFormats: ['rgb', 'colorName', 'hex', 'hsl'],
			format: (typeof format === 'undefined') ? 'rgb' : format,
			transparency: (typeof transparency === 'undefined') ? false : transparency
		};

		if (self.options.availableFormats.indexOf(format) !== -1) {
			return self[self.options.format].init(self.options.transparency, self);
		} else {
			console.error('The color type (' + format + ') is not supported');
		}
	},

	/**
	 * A class for generating a random rgb(a) colour value
	 * @type {Object}
	 */
	rgb: {

		/**
		 * The rgb(a) constructor
		 * @param  {Boolean/Number} transparency If true/false than a random number is generate for transparency, if a Number then that number is used
		 * @param  {Object} parent       A reference to the parent namespace, if none supplied Mondrian is inferred
		 * @return {String}              A random rgb(a) formatted color
		 */
		init: function (transparency, parent) {
			'use strict';
			var context = (typeof parent === 'undefined') ? Mondrian : parent;
			return 'rgb' + ((transparency !== false) ? 'a' : '') + '(' + this.randomInt() + ',' + this.randomInt() + ',' + this.randomInt() + ((transparency !== false) ? ',' + context.transparency(transparency) : '') + ')';
		},

		/**
		 * A method to generate a random number less than 256
		 * @return {Number} A random number <256
		 */
		randomInt: function () {
			'use strict';
			return Math.floor(Math.random() * 256);
		}

	},

	/**
	 * A class for returning a random HTMl 4.01 color name
	 * @type {Object}
	 */
	colorName: {

		/**
		 * HTMl safe colours as defined by the HTML 4.01 spec (see here http://en.wikipedia.org/wiki/Web_colors#HTML_color_names)
		 * @type {Array}
		 */
		NAMES: ['White', 'Silver', 'Gray', 'Black', 'Red', 'Maroon', 'Yellow', 'Olive', 'Lime', 'Green', 'Aqua', 'Teal', 'Blue', 'Navy', 'Fuchsia', 'Purple'],

		/**
		 * The colorName constructor
		 * @return {String} A random HTML 4.01 safe color name
		 */
		init: function () {
			'use strict';
			return this.NAMES[Math.floor(Math.random() * this.NAMES.length)];
		}

	},

	/**
	 * A class for generating a random hex color
	 * @type {Object}
	 */
	hex: {

		/**
		 * The hex constructor
		 * @return {String} A hex color string
		 */
		init: function () {
			'use strict';
			// Bit shift ALL THE THINGS
			return '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
		}

	},

	/**
	 * A class for generating a random hsl(a) color
	 * @type {Object}
	 */
	hsl: {

		/**
		 * The hsl(a) constructor
		 * @param  {Boolean/Number} transparency If true/false than a random number is generate for transparency, if a Number then that number is used
		 * @param  {Object} parent       A reference to the parent namespace, if none supplied Mondrian is inferred
		 * @return {String}              A random rgb(a) formatted color
		 */
		init: function (transparency, parent) {
			'use strict';
			var context = (typeof parent === 'undefined') ? Mondrian : parent;
			return 'hsl' + ((transparency !== false) ? 'a' : '') + '(' + this.hue() + ',' + this.satLight() + '%,' + this.satLight() + '%' + ((transparency !== false) ? ',' + context.transparency(transparency) : '') + ')';
		},

		/**
		 * A method to generate a random number less than 360
		 * @return {Number} A random number <360
		 */
		hue: function () {
			'use strict';
			return Math.floor(Math.random() * 360);
		},

		/**
		 * A method to generate a random number less than 100
		 * @return {Number} A random number <100
		 */
		satLight: function () {
			'use strict';
			return Math.floor(Math.random() * 100);
		}

	},

	/**
	 * A method for either generating a random int <100 or returning the user defined value
	 * @param  {Boolean/Number} transparency If true/false than a random number is generate for transparency, if a Number then that number is used
	 * @return {Number}              A transparency value
	 */
	transparency: function (transparency) {
		'use strict';
		return (typeof transparency !== 'number') ? Math.floor(Math.random() * 100) : transparency;
	}

};