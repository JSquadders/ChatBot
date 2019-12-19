const _g = '0123456789abcdef'.split('');

export class Cryptography {	
	static _f(p) {
		let o = '', m = 0;
		for (; m < 4; m++) {
			o += _g[(p >> (m * 8 + 4)) & 15] + _g[(p >> (m * 8)) & 15];
		}
		return o;
	}
	
	static _d(n, m) {
		return (n + m) & 4294967295;
	}
	
	static _j(u, o, n, m, r, p) {
		o = this._d(this._d(o, u), this._d(m, p));
		return this._d((o << r) | (o >>> (32 - r)), n);
	}
	
	static _e(o, n, u, r, m, q, p) {
		return this._j(n ^ u ^ r, o, n, m, q, p);
	}
	
	static _k(o, n, u, r, m, q, p) {
		return this._j(u ^ (n | (~r)), o, n, m, q, p);
	}
	
	static _h(o, n, u, r, m, q, p) {
		return this._j((n & r) | (u & (~r)), o, n, m, q, p);
	}
	
	static _a(o, n, u, r, m, q, p) {
		return this._j((n & u) | ((~n) & r), o, n, m, q, p);
	}
	
	static _c(n, p) {
		let o = n[0], m = n[1], r = n[2], q = n[3];
		o = this._a(o, m, r, q, p[0], 7, - 680876936);
		q = this._a(q, o, m, r, p[1], 12, - 389564586);
		r = this._a(r, q, o, m, p[2], 17, 606105819);
		m = this._a(m, r, q, o, p[3], 22, - 1044525330);
		o = this._a(o, m, r, q, p[4], 7, - 176418897);
		q = this._a(q, o, m, r, p[5], 12, 1200080426);
		r = this._a(r, q, o, m, p[6], 17, - 1473231341);
		m = this._a(m, r, q, o, p[7], 22, - 45705983);
		o = this._a(o, m, r, q, p[8], 7, 1770035416);
		q = this._a(q, o, m, r, p[9], 12, - 1958414417);
		r = this._a(r, q, o, m, p[10], 17, - 42063);
		m = this._a(m, r, q, o, p[11], 22, - 1990404162);
		o = this._a(o, m, r, q, p[12], 7, 1804603682);
		q = this._a(q, o, m, r, p[13], 12, - 40341101);
		r = this._a(r, q, o, m, p[14], 17, - 1502002290);
		m = this._a(m, r, q, o, p[15], 22, 1236535329);
		o = this._h(o, m, r, q, p[1], 5, - 165796510);
		q = this._h(q, o, m, r, p[6], 9, - 1069501632);
		r = this._h(r, q, o, m, p[11], 14, 643717713);
		m = this._h(m, r, q, o, p[0], 20, - 373897302);
		o = this._h(o, m, r, q, p[5], 5, - 701558691);
		q = this._h(q, o, m, r, p[10], 9, 38016083);
		r = this._h(r, q, o, m, p[15], 14, - 660478335);
		m = this._h(m, r, q, o, p[4], 20, - 405537848);
		o = this._h(o, m, r, q, p[9], 5, 568446438);
		q = this._h(q, o, m, r, p[14], 9, - 1019803690);
		r = this._h(r, q, o, m, p[3], 14, - 187363961);
		m = this._h(m, r, q, o, p[8], 20, 1163531501);
		o = this._h(o, m, r, q, p[13], 5, - 1444681467);
		q = this._h(q, o, m, r, p[2], 9, - 51403784);
		r = this._h(r, q, o, m, p[7], 14, 1735328473);
		m = this._h(m, r, q, o, p[12], 20, - 1926607734);
		o = this._e(o, m, r, q, p[5], 4, - 378558);
		q = this._e(q, o, m, r, p[8], 11, - 2022574463);
		r = this._e(r, q, o, m, p[11], 16, 1839030562);
		m = this._e(m, r, q, o, p[14], 23, - 35309556);
		o = this._e(o, m, r, q, p[1], 4, - 1530992060);
		q = this._e(q, o, m, r, p[4], 11, 1272893353);
		r = this._e(r, q, o, m, p[7], 16, - 155497632);
		m = this._e(m, r, q, o, p[10], 23, - 1094730640);
		o = this._e(o, m, r, q, p[13], 4, 681279174);
		q = this._e(q, o, m, r, p[0], 11, - 358537222);
		r = this._e(r, q, o, m, p[3], 16, - 722521979);
		m = this._e(m, r, q, o, p[6], 23, 76029189);
		o = this._e(o, m, r, q, p[9], 4, - 640364487);
		q = this._e(q, o, m, r, p[12], 11, - 421815835);
		r = this._e(r, q, o, m, p[15], 16, 530742520);
		m = this._e(m, r, q, o, p[2], 23, - 995338651);
		o = this._k(o, m, r, q, p[0], 6, - 198630844);
		q = this._k(q, o, m, r, p[7], 10, 1126891415);
		r = this._k(r, q, o, m, p[14], 15, - 1416354905);
		m = this._k(m, r, q, o, p[5], 21, - 57434055);
		o = this._k(o, m, r, q, p[12], 6, 1700485571);
		q = this._k(q, o, m, r, p[3], 10, - 1894986606);
		r = this._k(r, q, o, m, p[10], 15, - 1051523);
		m = this._k(m, r, q, o, p[1], 21, - 2054922799);
		o = this._k(o, m, r, q, p[8], 6, 1873313359);
		q = this._k(q, o, m, r, p[15], 10, - 30611744);
		r = this._k(r, q, o, m, p[6], 15, - 1560198380);
		m = this._k(m, r, q, o, p[13], 21, 1309151649);
		o = this._k(o, m, r, q, p[4], 6, - 145523070);
		q = this._k(q, o, m, r, p[11], 10, - 1120210379);
		r = this._k(r, q, o, m, p[2], 15, 718787259);
		m = this._k(m, r, q, o, p[9], 21, - 343485551);
		n[0] = this._d(o, n[0]);
		n[1] = this._d(m, n[1]);
		n[2] = this._d(r, n[2]);
		n[3] = this._d(q, n[3]);
	}
	
	static _i(p) {
		// let txt = '';
		let r = p.length, q = [1732584193, - 271733879, - 1732584194, 271733878], o;
		// for (o = 64; o <= p.length; o += 64) {
		// 	this._c(q, l(p.substring(o - 64, o)));
		// }
		p = p.substring(o - 64);
		let m = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		for (o = 0; o < p.length; o++) {
			m[o >> 2] |= p.charCodeAt(o) << ((o % 4) << 3);
		}
		m[o >> 2] |= 128 << ((o % 4) << 3);
		if (o > 55) {
			this._c(q, m);
			for (o = 0; o < 16; o++) {
				m[o] = 0;
			}
		}
		m[14] = r * 8;
		this._c(q, m);
		return q;
	}
		
	static _b(m) {
		for (let n = 0; n < m.length; n++) {
			m[n] = this._f(m[n]);
		}
		return m.join('');
	}
	
	static md5(m) {
		return this._b(this._i(m));
	}

	static messageEncode(msg) {
		let msgEncoded = '', sBuffer = '';
		for (let i = 0; i <= msg.length; i++) {
			if (msg.charCodeAt(i) > 255) {
				sBuffer = escape(msg.charAt(i));
				if (sBuffer.substring(0, 2) == '%u') {
					msgEncoded += '|' + sBuffer.substring(2, sBuffer.length);
				} else {
					msgEncoded += sBuffer;
				}
			} else {
				msgEncoded += msg.charAt(i);
			}
		}
		
		msgEncoded = msgEncoded.replace('|201C', '\'').replace('|201D', '\'').replace('|2018', '\'').replace('|2019', '\'').replace('`', '\'').replace('%B4', '\'').replace('|FF20', '').replace('|FE6B', '');
		msgEncoded = escape(msgEncoded);
		return msgEncoded;
	}
}