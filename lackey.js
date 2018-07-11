/* 
	Lackey by onyokneesdog (no jquery)
	last edit: 04.07.2018
	
	00. String helpers
	01. Math
	02. Cookies
	03. HTML Elements
	
*/

class Lackey {

//# 00. >> String helpers >>

	/* Transform array like [[1,2,3],[4],[5,6]] to string "1,2,3|4|5,6" */
	static matrixToString(arr) {
		var s = '';
		for (var i = 0; i < arr.length; i++) {
			for (var j = 0; j < arr[i].length; j++)
				s = (j < arr[i].length - 1) ? s + arr[i][j] + ',' : s + arr[i][j];
			s = (i < arr.length - 1) ? s + '|' : s;
		}
		return s;
	}
	
	/* Transform string to matrix */
	static stringToMatrix(s) {
		var l = s.split('|');
		var arr = new Array(l.length);
		for (var i = 0; i < l.length; i++) {
			var b = l[i].split(',');
			arr[i] = new Array(b.length);
			for (var j = 0; j < b.length; j++) 
				arr[i][j] = b[j] * 1.0;
		}
		return arr;
	}
	
	/* Get first Float from string */
	static floatFromString(s) {
		var t = '';
		var started = false;
		var dotted = false; 
		var numbers = '0123456789';
		var dot = '.';
		for (var i = 0; i < s.length; i++)
			if (numbers.indexOf(s[i]) + 1) {
				t = t + s[i];
				started = true;
			} else if (s[i] == dot && !dotted && i < s.length - 1 && (numbers.indexOf(s[i + 1]) + 1)) {
				t = t + dot;
				dotted = true;
			} else if (started) break;
		return parseFloat(t, 10);
	}
	
//# 01. >> Math >>	

	/* Get array sum */
	static arraySum(arr, x1, x2) {
		if (!x1) x1 = 0;
		if (!x2) x2 = arr.length - 1;
		var sum = 0;
		for (var i = x1; i <= x2; i++)
			sum += arr[i] * 1.0;
		return sum;
	}
	
	/* Count elements by adjusted range */
	static arrayCountElementsByRange(arr, r1, r2) {
		var c = 0;
		for (var i = 0; i < arr.length; i++)
			if (arr[i] >= r1 && arr[i] <= r2) c++;
		return c;
	}
	
//# 02. >> Cookie >>
	
	/* Set cookie */
	static createCookie(name, value, days) {
		if (days) {
			var date = new Date();
			date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
			var expires = "; expires=" + date.toGMTString();
		}
		else var expires = "";
		document.cookie = name + "=" + value + expires + "; path=/";
	}

	/* Get cookie value */
	static readCookie(name, default_value) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for(var i = 0; i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) == ' ') c = c.substring(1, c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
		}
		return default_value;
	}

	/* Delete cookie */
	static eraseCookie(name) {
		createCookie(name, "", -1);
	}
	
//# 03. >> Elements >>
	
	/* Get parent element with specific class name */
	static getParentByClass(element, name) {
		var parent = element;
		while (parent.tagName != 'BODY')	{
			parent = parent.parentNode;
			if (parent.className.indexOf(name) >= 0) break;
		}
		return parent;
	}

	/* Get parent element by Id */
	static getParentById(element, id) {
		var parent = element;
		while (parent.tagName != 'BODY')	{
			parent = parent.parentNode;
			if (parent.id == id) break;
		}
		return parent;
	}
	
}