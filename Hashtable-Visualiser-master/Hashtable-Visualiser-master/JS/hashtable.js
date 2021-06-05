var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
// implementation of a hashtable with linear probing
var HashTable = /** @class */ (function () {
    function HashTable(initialCapacity, notify) {
        this.notifyController = notify;
        this.LOAD_FACTOR = 0.75;
        this.keys = [];
        this.entryCount = 0;
        this.arrayLength = initialCapacity;
    }
    HashTable.prototype.add = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var index, offset;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        offset = 0;
                        _a.label = 1;
                    case 1:
                        index = this.hashFunction(key + offset);
                        offset++;
                        return [4 /*yield*/, this.notifyController(0 /* Searching */, index)];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        if (this.keys[index] !== undefined && this.keys[index] !== key) return [3 /*break*/, 1];
                        _a.label = 4;
                    case 4: return [4 /*yield*/, this.notifyController(1 /* Found */, index)];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, this.notifyController(2 /* UpdateVal */, [index, key])];
                    case 6:
                        _a.sent();
                        this.entryCount += this.keys[index] === undefined ? 1 : 0;
                        this.keys[index] = key;
                        this.handleArrayResize();
                        return [2 /*return*/];
                }
            });
        });
    };
    HashTable.prototype.contains = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getIndexOfKey(key)];
                    case 1: return [2 /*return*/, (_a.sent()) !== -1];
                }
            });
        });
    };
    HashTable.prototype.clear = function () {
        this.keys = [];
        this.entryCount = 0;
    };
    HashTable.prototype["delete"] = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var index;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getIndexOfKey(key)];
                    case 1:
                        index = _a.sent();
                        if (index === -1) {
                            return [2 /*return*/, false];
                        }
                        this.keys[index] = null;
                        return [4 /*yield*/, this.notifyController(2 /* UpdateVal */, [index, null])];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, true];
                }
            });
        });
    };
    HashTable.prototype.handleArrayResize = function () {
        if (this.arrayLength * this.LOAD_FACTOR < this.entryCount) {
            this.expandArray();
        }
    };
    HashTable.prototype.hashFunction = function (arg) {
        return Math.abs(arg) % this.arrayLength;
    };
    HashTable.prototype.expandArray = function () {
        return __awaiter(this, void 0, void 0, function () {
            var oldKeyArray, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        oldKeyArray = this.keys;
                        this.clear();
                        this.arrayLength *= 2;
                        return [4 /*yield*/, this.notifyController(3 /* ExpandArray */, this.arrayLength)];
                    case 1:
                        _a.sent();
                        i = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i < this.arrayLength / 2)) return [3 /*break*/, 5];
                        if (!(oldKeyArray[i] !== undefined && oldKeyArray[i] !== null)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.add(oldKeyArray[i])];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        i++;
                        return [3 /*break*/, 2];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    HashTable.prototype.getIndexOfKey = function (key) {
        return __awaiter(this, void 0, void 0, function () {
            var index, offset;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        offset = 0;
                        _a.label = 1;
                    case 1:
                        index = this.hashFunction(key + offset);
                        return [4 /*yield*/, this.notifyController(0 /* Searching */, index)];
                    case 2:
                        _a.sent();
                        if (!(this.keys[index] === undefined)) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.notifyController(4 /* NotFound */, index)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, -1];
                    case 4:
                        offset++;
                        _a.label = 5;
                    case 5:
                        if (this.keys[index] !== key) return [3 /*break*/, 1];
                        _a.label = 6;
                    case 6: return [4 /*yield*/, this.notifyController(1 /* Found */, index)];
                    case 7:
                        _a.sent();
                        return [2 /*return*/, index];
                }
            });
        });
    };
    return HashTable;
}());
