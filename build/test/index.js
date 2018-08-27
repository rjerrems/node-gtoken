"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var assert = require("assert");
var fs = require("fs");
var nock = require("nock");
var index_1 = require("../src/index");
var EMAIL = 'example@developer.gserviceaccount.com';
var UNKNOWN_KEYFILE = './test/assets/key';
var KEYFILE = './test/assets/key.pem';
var P12FILE = './test/assets/key.p12';
var KEYFILEJSON = './test/assets/key.json';
var KEYFILENOEMAILJSON = './test/assets/key-no-email.json';
var KEYCONTENTS = fs.readFileSync(KEYFILE, 'utf8');
var KEYJSONCONTENTS = fs.readFileSync(KEYFILEJSON, 'utf8');
var GOOGLE_TOKEN_URLS = ['https://www.googleapis.com', '/oauth2/v4/token'];
var GOOGLE_REVOKE_TOKEN_URLS = ['https://accounts.google.com', '/o/oauth2/revoke', '?token='];
var TESTDATA = {
    email: 'email@developer.gserviceaccount.com',
    scope: 'scope123',
    key: KEYCONTENTS
};
var TESTDATA_KEYFILE = {
    email: 'email@developer.gserviceaccount.com',
    sub: 'developer@gmail.com',
    scope: 'scope123',
    keyFile: KEYFILE
};
var TESTDATA_UNKNOWN = {
    keyFile: UNKNOWN_KEYFILE
};
var TESTDATA_KEYFILENOEMAIL = {
    scope: 'scope123',
    keyFile: KEYFILE
};
var TESTDATA_KEYFILEJSON = {
    scope: 'scope123',
    keyFile: KEYFILEJSON
};
var TESTDATA_KEYFILENOEMAILJSON = {
    scope: 'scope123',
    keyFile: KEYFILENOEMAILJSON
};
var TESTDATA_P12 = {
    email: 'email@developer.gserviceaccount.com',
    scope: 'scope123',
    keyFile: P12FILE
};
var TESTDATA_P12_NO_EMAIL = {
    scope: 'scope123',
    keyFile: P12FILE
};
nock.disableNetConnect();
it('should exist', function () {
    assert.equal(typeof index_1.GoogleToken, 'function');
});
it('should work without new or options', function () {
    var gtoken = new index_1.GoogleToken();
    assert(gtoken);
});
describe('.iss', function () {
    it('should be set from email option', function () {
        var gtoken = new index_1.GoogleToken({ email: EMAIL });
        assert.equal(gtoken.iss, EMAIL);
        assert.equal(gtoken.email, undefined);
    });
    it('should be set from iss option', function () {
        var gtoken = new index_1.GoogleToken({ iss: EMAIL });
        assert.equal(gtoken.iss, EMAIL);
    });
    it('should be set from sub option', function () {
        var gtoken = new index_1.GoogleToken({ sub: EMAIL });
        assert.equal(gtoken.sub, EMAIL);
    });
    it('should be set from email option over iss option', function () {
        var gtoken = new index_1.GoogleToken({ iss: EMAIL, email: 'another' + EMAIL });
        assert.equal(gtoken.iss, 'another' + EMAIL);
    });
});
describe('.scope', function () {
    it('should accept strings', function () {
        var gtoken = new index_1.GoogleToken({ scope: 'hello world' });
        assert.equal(gtoken.scope, 'hello world');
    });
    it('should accept array of strings', function () {
        var gtoken = new index_1.GoogleToken({ scope: ['hello', 'world'] });
        assert.equal(gtoken.scope, 'hello world');
    });
});
describe('.hasExpired()', function () {
    it('should exist', function () {
        var gtoken = new index_1.GoogleToken();
        assert.equal(typeof gtoken.hasExpired, 'function');
    });
    it('should detect expired tokens', function () {
        var gtoken = new index_1.GoogleToken();
        assert(gtoken.hasExpired(), 'should be expired without token');
        gtoken.token = 'hello';
        assert(gtoken.hasExpired(), 'should be expired without expires_at');
        gtoken.expiresAt = (new Date().getTime()) + 10000;
        assert(!gtoken.hasExpired(), 'shouldnt be expired with future date');
        gtoken.expiresAt = (new Date().getTime()) - 10000;
        assert(gtoken.hasExpired(), 'should be expired with past date');
        gtoken.expiresAt = (new Date().getTime()) + 10000;
        gtoken.token = null;
        assert(gtoken.hasExpired(), 'should be expired with no token');
    });
});
describe('.revokeToken()', function () {
    it('should exist', function () {
        var gtoken = new index_1.GoogleToken();
        assert.equal(typeof gtoken.revokeToken, 'function');
    });
    it('should run accept config properties', function (done) {
        var token = 'w00t';
        var scope = createRevokeMock(token);
        var gtoken = new index_1.GoogleToken();
        gtoken.token = token;
        gtoken.revokeToken(function (err) {
            assert.equal(gtoken.token, null);
            scope.done();
            done();
        });
    });
    it('should return appropriate error with HTTP 404s', function (done) {
        var token = 'w00t';
        var scope = createRevokeMock(token, 404);
        var gtoken = new index_1.GoogleToken();
        gtoken.token = token;
        gtoken.revokeToken(function (err) {
            assert(err);
            scope.done();
            done();
        });
    });
    it('should run accept config properties with async', function () { return __awaiter(_this, void 0, void 0, function () {
        var token, scope, gtoken;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    token = 'w00t';
                    scope = createRevokeMock(token);
                    gtoken = new index_1.GoogleToken();
                    gtoken.token = token;
                    return [4 /*yield*/, gtoken.revokeToken()];
                case 1:
                    _a.sent();
                    assert.equal(gtoken.token, null);
                    scope.done();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should return error when no token set', function (done) {
        var gtoken = new index_1.GoogleToken();
        gtoken.token = null;
        gtoken.revokeToken(function (err) {
            assert(err && err.message);
            done();
        });
    });
    it('should return error when no token set with async', function () { return __awaiter(_this, void 0, void 0, function () {
        var gtoken, err, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    gtoken = new index_1.GoogleToken();
                    gtoken.token = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, gtoken.revokeToken()];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_1 = _a.sent();
                    err = e_1;
                    return [3 /*break*/, 4];
                case 4:
                    assert(err && err.message);
                    return [2 /*return*/];
            }
        });
    }); });
});
describe('.getToken()', function () {
    it('should exist', function () {
        var gtoken = new index_1.GoogleToken();
        assert.equal(typeof gtoken.getToken, 'function');
    });
    it('should read .pem keyFile from file', function (done) {
        var gtoken = new index_1.GoogleToken(TESTDATA_KEYFILE);
        var scope = createGetTokenMock();
        gtoken.getToken(function (err, token) {
            assert.deepEqual(gtoken.key, KEYCONTENTS);
            scope.done();
            done();
        });
    });
    it('should read .pem keyFile from file async', function () { return __awaiter(_this, void 0, void 0, function () {
        var gtoken, scope, token;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    gtoken = new index_1.GoogleToken(TESTDATA_KEYFILE);
                    scope = createGetTokenMock();
                    return [4 /*yield*/, gtoken.getToken()];
                case 1:
                    token = _a.sent();
                    scope.done();
                    assert.deepEqual(gtoken.key, KEYCONTENTS);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should return error if iss is not set with .pem', function (done) {
        var gtoken = new index_1.GoogleToken(TESTDATA_KEYFILENOEMAIL);
        gtoken.getToken(function (err) {
            assert(err);
            if (err) {
                assert.strictEqual(err.code, 'MISSING_CREDENTIALS');
                done();
            }
        });
    });
    it('should return err if neither key nor keyfile are set', function (done) {
        var gtoken = new index_1.GoogleToken();
        gtoken.getToken(function (err, token) {
            assert(err);
            done();
        });
    });
    it('should read .json key from file', function (done) {
        var gtoken = new index_1.GoogleToken(TESTDATA_KEYFILEJSON);
        var scope = createGetTokenMock();
        gtoken.getToken(function (err, token) {
            scope.done();
            assert.equal(err, null);
            var parsed = JSON.parse(KEYJSONCONTENTS);
            assert.deepEqual(gtoken.key, parsed.private_key);
            assert.deepEqual(gtoken.iss, parsed.client_email);
            done();
        });
    });
    it('should accept additional claims', function () { return __awaiter(_this, void 0, void 0, function () {
        var opts, gtoken, scope, token;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    opts = Object.assign(TESTDATA_KEYFILE, { additionalClaims: { fancyClaim: 'isFancy' } });
                    gtoken = new index_1.GoogleToken(opts);
                    scope = createGetTokenMock();
                    return [4 /*yield*/, gtoken.getToken()];
                case 1:
                    token = _a.sent();
                    scope.done();
                    assert.deepEqual(gtoken.key, KEYCONTENTS);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should return error if iss is not set with .json', function (done) {
        var gtoken = new index_1.GoogleToken(TESTDATA_KEYFILENOEMAILJSON);
        gtoken.getToken(function (err) {
            assert(err);
            if (err) {
                assert.strictEqual(err.code, 'MISSING_CREDENTIALS');
                done();
            }
        });
    });
    it('should return cached token if not expired', function (done) {
        var gtoken = new index_1.GoogleToken(TESTDATA);
        gtoken.token = 'mytoken';
        gtoken.expiresAt = new Date().getTime() + 10000;
        gtoken.getToken(function (err, token) {
            assert.equal(token, 'mytoken');
            done();
        });
    });
    it('should run gp12pem if .p12 file is given', function (done) {
        var gtoken = new index_1.GoogleToken(TESTDATA_P12);
        var scope = createGetTokenMock();
        gtoken.getToken(function (err, token) {
            scope.done();
            assert.equal(err, null);
            done();
        });
    });
    it('should return error if iss is not set with .p12', function (done) {
        var gtoken = new index_1.GoogleToken(TESTDATA_P12_NO_EMAIL);
        gtoken.getToken(function (err) {
            assert(err);
            if (err) {
                assert.strictEqual(err.code, 'MISSING_CREDENTIALS');
                done();
            }
        });
    });
    it('should return error if unknown file type is used', function (done) {
        var gtoken = new index_1.GoogleToken(TESTDATA_UNKNOWN);
        gtoken.getToken(function (err) {
            assert(err);
            if (err) {
                assert.strictEqual(err.code, 'UNKNOWN_CERTIFICATE_TYPE');
                done();
            }
        });
    });
    describe('request', function () {
        it('should be run with correct options', function (done) {
            var gtoken = new index_1.GoogleToken(TESTDATA);
            var fakeToken = 'nodeftw';
            var scope = createGetTokenMock(200, { 'access_token': fakeToken });
            gtoken.getToken(function (err, token) {
                scope.done();
                assert.equal(err, null);
                assert.equal(token, fakeToken);
                done();
            });
        });
        it('should set and return correct properties on success', function (done) {
            var gtoken = new index_1.GoogleToken(TESTDATA);
            var RESPBODY = {
                access_token: 'accesstoken123',
                expires_in: 3600,
                token_type: 'Bearer'
            };
            var scope = createGetTokenMock(200, RESPBODY);
            gtoken.getToken(function (err, token) {
                scope.done();
                assert.deepEqual(gtoken.rawToken, RESPBODY);
                assert.equal(gtoken.token, 'accesstoken123');
                assert.equal(gtoken.token, token);
                assert.equal(err, null);
                assert(gtoken.expiresAt);
                if (gtoken.expiresAt) {
                    assert(gtoken.expiresAt >= (new Date()).getTime());
                    assert(gtoken.expiresAt <= (new Date()).getTime() + (3600 * 1000));
                }
                done();
            });
        });
        it('should set and return correct properties on error', function (done) {
            var ERROR = 'An error occurred.';
            var gtoken = new index_1.GoogleToken(TESTDATA);
            var scope = createGetTokenMock(500, { error: ERROR });
            gtoken.getToken(function (err, token) {
                scope.done();
                assert(err);
                assert.equal(gtoken.rawToken, null);
                assert.equal(gtoken.token, null);
                assert.equal(gtoken.token, token);
                if (err)
                    assert.equal(err.message, ERROR);
                assert.equal(gtoken.expiresAt, null);
                done();
            });
        });
        it('should include error_description from remote error', function (done) {
            var gtoken = new index_1.GoogleToken(TESTDATA);
            var ERROR = 'error_name';
            var DESCRIPTION = 'more detailed message';
            var RESPBODY = { error: ERROR, error_description: DESCRIPTION };
            var scope = createGetTokenMock(500, RESPBODY);
            gtoken.getToken(function (err, token) {
                scope.done();
                assert(err instanceof Error);
                if (err) {
                    assert.equal(err.message, ERROR + ': ' + DESCRIPTION);
                    done();
                }
            });
        });
        it('should provide an appropriate error for a 404', function (done) {
            var gtoken = new index_1.GoogleToken(TESTDATA);
            var message = 'Request failed with status code 404';
            var scope = createGetTokenMock(404);
            gtoken.getToken(function (err, token) {
                scope.done();
                assert(err instanceof Error);
                if (err)
                    assert.equal(err.message, message);
                done();
            });
        });
    });
    it('should return credentials outside of getToken flow', function () { return __awaiter(_this, void 0, void 0, function () {
        var gtoken, creds;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    gtoken = new index_1.GoogleToken(TESTDATA_KEYFILEJSON);
                    return [4 /*yield*/, gtoken.getCredentials(KEYFILEJSON)];
                case 1:
                    creds = _a.sent();
                    assert(creds.privateKey);
                    assert(creds.clientEmail);
                    return [2 /*return*/];
            }
        });
    }); });
});
function createGetTokenMock(code, body) {
    if (code === void 0) { code = 200; }
    return nock(GOOGLE_TOKEN_URLS[0])
        .replyContentLength()
        .post(GOOGLE_TOKEN_URLS[1], {
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: /.?/
    }, { reqheaders: { 'Content-Type': 'application/x-www-form-urlencoded' } })
        .reply(code, body);
}
function createRevokeMock(token, code) {
    if (code === void 0) { code = 200; }
    return nock(GOOGLE_REVOKE_TOKEN_URLS[0])
        .get(GOOGLE_REVOKE_TOKEN_URLS[1])
        .query({ token: token })
        .reply(code);
}
//# sourceMappingURL=index.js.map