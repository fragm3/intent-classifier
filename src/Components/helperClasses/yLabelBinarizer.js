var LabelBinarizer = /** @class */ (function () {
    function LabelBinarizer(neg_label, pos_label) {
        if (neg_label === void 0) { neg_label = 0; }
        if (pos_label === void 0) { pos_label = 1; }
        this.neg_label = neg_label;
        this.pos_label = pos_label;
        this.classes_ = [];
        if (this.neg_label >= this.pos_label) {
            throw new Error("neg_label=" + this.neg_label + " must be strictly less than posLabel=" + pos_label + ".");
        }
    }
    LabelBinarizer.prototype.fit = function (y) {
        this.classes_ = this.unique_labels(y);
        return this;
    };
    LabelBinarizer.prototype.transform = function (y) {
        var _this = this;
        var n_classes = this.classes_.length;
        var classes = this.classes_.sort();
        var indices = this.search_sorted(classes);
        return y.map(function (x) {
            var b = new Array(n_classes).fill(_this.neg_label);
            var idx = indices[x];
            b[idx] = _this.pos_label;
            return b;
        });
    };
    LabelBinarizer.prototype.fit_transform = function (y) {
        return this.fit(y).transform(y);
    };
    LabelBinarizer.prototype.unique_labels = function (y) {
        var labels = new Set();
        for (var _i = 0, y_1 = y; _i < y_1.length; _i++) {
            var x = y_1[_i];
            labels.add(x);
        }
        return Array.from(labels);
    };
    LabelBinarizer.prototype.search_sorted = function (classes) {
        var indices = {};
        classes.forEach(function (cls, idx) {
            indices[cls] = idx;
        });
        return indices;
    };
    return LabelBinarizer;
}());

export default LabelBinarizer;