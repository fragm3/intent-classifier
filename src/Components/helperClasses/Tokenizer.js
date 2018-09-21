var Tokenizer = /** @class */ (function () {
    function Tokenizer(num_words, filters, split, lower, document_count) {
        if (num_words === void 0) { num_words = 0; }
        if (filters === void 0) { filters = '!"#$%&()*+,-./:;<=>?@[\\]^_`{|}~\t\n'; }
        if (split === void 0) { split = ' '; }
        if (lower === void 0) { lower = true; }
        if (document_count === void 0) { document_count = 0; }
        this.num_words = num_words;
        this.filters = filters;
        this.split = split;
        this.lower = lower;
        this.document_count = document_count;
        this.tokens = [];
        this.word_counts = {};
        this.word_docs = {};
        this.word_index = {};
        this.index_word = {};
        this.index_docs = {};
    }
    Tokenizer.prototype.fit_on_texts = function (texts) {
        var _this = this;
        for (var _i = 0, texts_1 = texts; _i < texts_1.length; _i++) {
            var text = texts_1[_i];
            this.document_count += 1;
            if (this.lower) {
                if (!text) {
                    text = (text || "").toLowerCase();
                }
            }
            var seq = this.text_to_word_sequence(text);
            for (var _a = 0, seq_1 = seq; _a < seq_1.length; _a++) {
                var w = seq_1[_a];
                if (w in this.word_counts) {
                    this.word_counts[w] += 1;
                }
                else {
                    this.word_counts[w] = 1;
                }
            }
            for (var _b = 0, _c = Array.from((new Set(seq))); _b < _c.length; _b++) {
                var w = _c[_b];
                if (w in this.word_docs) {
                    this.word_docs[w] += 1;
                }
                else {
                    this.word_docs[w] = 1;
                }
            }
        }
        var wcounts = this.map_to_array(this.word_counts);
        wcounts.sort(function (a, b) { return b[1] - a[1]; });
        var sorted_voc = [];
        for (var _d = 0, wcounts_1 = wcounts; _d < wcounts_1.length; _d++) {
            var wc = wcounts_1[_d];
            sorted_voc.push(wc[0]);
        }
        sorted_voc.forEach(function (word, index) {
            _this.word_index[word] = index + 1;
        });
        for (var _e = 0, _f = Object.entries(this.word_index); _e < _f.length; _e++) {
            var _g = _f[_e], w = _g[0], c = _g[1];
            this.index_word[c] = w;
        }
        for (var _h = 0, _j = Object.entries(this.word_docs); _h < _j.length; _h++) {
            var _k = _j[_h], w = _k[0], c = _k[1];
            this.index_docs[this.word_index[w]] = c;
        }
    };
    Tokenizer.prototype.texts_to_matrix = function (texts, mode) {
        if (mode === void 0) { mode = 'binary'; }
        var sequences = this.texts_to_sequences(texts);
        return this.sequences_to_matrix(sequences, mode);
    };
    Tokenizer.prototype.text_to_word_sequence = function (text) {
        for (var _i = 0, _a = this.filters; _i < _a.length; _i++) {
            var c = _a[_i];
            text = text.replace(new RegExp("[\\" + c + "]", 'gi'), this.split);
        }
        return text.split(this.split).filter(function (x) { return x; });
    };
    Tokenizer.prototype.map_to_array = function (map) {
        var array = [];
        for (var k in map) {
            array.push([k, map[k]]);
        }
        return array;
    };
    Tokenizer.prototype.texts_to_sequences = function (texts) {
        var sequences = [];
        for (var _i = 0, texts_2 = texts; _i < texts_2.length; _i++) {
            var text = texts_2[_i];
            if (this.lower) {
                if (!text) {
                    text = (text || "").toLowerCase();
                }
            }
            var seq = this.text_to_word_sequence(text);
            var vect = [];
            for (var _a = 0, seq_2 = seq; _a < seq_2.length; _a++) {
                var w = seq_2[_a];
                var idx = this.word_index[w];
                if (idx) {
                    if (this.num_words > 0 && idx < this.num_words) {
                        vect.push(idx);
                    }
                    else if (!this.num_words) {
                        vect.push(idx);
                    }
                }
            }
            sequences.push(vect);
        }
        return sequences;
    };
    Tokenizer.prototype.sequences_to_matrix = function (sequences, mode) {
        var _this = this;
        var num_words = this.num_words ? this.num_words : Object.keys(this.word_index).length;
        var x = new Array(sequences.length);
        for (var k = 0; k < sequences.length; k++) {
            x[k] = new Array(num_words).fill(0);
        }
        sequences.forEach(function (seq, i) {
            var counts = {};
            for (var _i = 0, seq_3 = seq; _i < seq_3.length; _i++) {
                var j = seq_3[_i];
                if (j <= num_words) {
                    counts[j] = (counts[j] || 0) + 1;
                }
            }
            for (var _a = 0, _b = Object.entries(counts); _a < _b.length; _a++) {
                var _c = _b[_a], j = _c[0], c = _c[1];
                if (mode === 'count') {
                    x[i][j] = c;
                }
                else if (mode === 'freq') {
                    x[i][j] = c / seq.length;
                }
                else if (mode === 'binary') {
                    x[i][j] = 1;
                }
                else if (mode === 'tfidf') {
                    var tf = 1 + Math.log(c);
                    var idf = Math.log(1 + _this.document_count / (1 + (_this.index_docs[j] || 0)));
                    x[i][j] = tf * idf;
                }
                else {
                    throw new Error("Unknown vectorization mode: " + mode);
                }
            }
        });
        return x;
    };
    return Tokenizer;
}());

export default Tokenizer;