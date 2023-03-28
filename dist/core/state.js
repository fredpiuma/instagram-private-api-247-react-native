"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.State = void 0;
const chance_1 = __importDefault(require("chance"));
const devices = __importStar(require("../samples/devices.json"));
const builds = __importStar(require("../samples/builds.json"));
const supportedCapabilities = __importStar(require("../samples/supported-capabilities.json"));
const Constants = __importStar(require("./constants"));
const errors_1 = require("../errors");
const decorators_1 = require("../decorators");
const debug_1 = __importDefault(require("debug"));
const AUTHORIZATION_TAG = Symbol('authorization-tag');
class State {
    constructor() {
        this.constants = Constants;
        this.supportedCapabilities = supportedCapabilities;
        this.language = 'pt_BR';
        this.timezoneOffset = String(new Date().getTimezoneOffset() * -60);
        this.radioType = 'wifi-none';
        this.capabilitiesHeader = '3brTv10=';
        this.connectionTypeHeader = 'WIFI';
        this.isLayoutRTL = false;
        this.euDCEnabled = undefined;
        this.adsOptOut = false;
        this.thumbnailCacheBustingValue = 1000;
        this.checkpoint = null;
        this.challenge = null;
        this.clientSessionIdLifetime = 1200000;
        this.pigeonSessionIdLifetime = 1200000;
    }
    get signatureKey() {
        return this.constants.SIGNATURE_KEY;
    }
    get signatureVersion() {
        return this.constants.SIGNATURE_VERSION;
    }
    get userBreadcrumbKey() {
        return this.constants.BREADCRUMB_KEY;
    }
    get appVersion() {
        return this.constants.APP_VERSION;
    }
    get appVersionCode() {
        return this.constants.APP_VERSION_CODE;
    }
    get fbAnalyticsApplicationId() {
        return this.constants.FACEBOOK_ANALYTICS_APPLICATION_ID;
    }
    get fbOtaFields() {
        return this.constants.FACEBOOK_OTA_FIELDS;
    }
    get fbOrcaApplicationId() {
        return this.constants.FACEBOOK_ORCA_APPLICATION_ID;
    }
    get loginExperiments() {
        return this.constants.LOGIN_EXPERIMENTS;
    }
    get experiments() {
        return this.constants.EXPERIMENTS;
    }
    get bloksVersionId() {
        return this.constants.BLOKS_VERSION_ID;
    }
    get clientSessionId() {
        return this.generateTemporaryGuid('clientSessionId', this.clientSessionIdLifetime);
    }
    get pigeonSessionId() {
        return this.generateTemporaryGuid('pigeonSessionId', this.pigeonSessionIdLifetime);
    }
    get appUserAgent() {
        return `Instagram ${this.appVersion} Android (${this.deviceString}; ${this.language}; ${this.appVersionCode})`;
    }
    get webUserAgent() {
        return `Mozilla/5.0 (Linux; Android ${this.devicePayload.android_release}; ${this.devicePayload.model} Build/${this.build}; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/70.0.3538.110 Mobile Safari/537.36 ${this.appUserAgent}`;
    }
    get devicePayload() {
        const deviceParts = this.deviceString.split(';');
        const [android_version, android_release] = deviceParts[0].split('/');
        const [manufacturer] = deviceParts[3].split('/');
        const model = deviceParts[4];
        return {
            android_version,
            android_release,
            manufacturer,
            model,
        };
    }
    get batteryLevel() {
        const chance = new chance_1.default(this.deviceId);
        const percentTime = chance.integer({ min: 200, max: 600 });
        return 100 - (Math.round(Date.now() / 1000 / percentTime) % 100);
    }
    get isCharging() {
        const chance = new chance_1.default(`${this.deviceId}${Math.round(Date.now() / 10800000)}`);
        return chance.bool();
    }
    get challengeUrl() {
        if (!this.checkpoint) {
            throw new errors_1.IgNoCheckpointError();
        }
        return `/api/v1${this.checkpoint.challenge.api_path}`;
    }
    get cookieCsrfToken() {
        return 'unset';
    }
    get cookieUserId() {
        const cookie = this.extractCookie('ds_user_id');
        if (cookie !== null) {
            return cookie.value;
        }
        this.updateAuthorization();
        if (!this.parsedAuthorization) {
            State.stateDebug('Could not find ds_user_id');
            throw new errors_1.IgCookieNotFoundError('ds_user_id');
        }
        return this.parsedAuthorization.ds_user_id;
    }
    get cookieUsername() {
        return null;
    }
    isExperimentEnabled(experiment) {
        return this.experiments.includes(experiment);
    }
    extractCookie(key) {
    }
    extractCookieValue(key) {
        return null;
    }
    extractUserId() {
        try {
            return this.cookieUserId;
        }
        catch (e) {
            if (this.challenge === null || !this.challenge.user_id) {
                throw new errors_1.IgUserIdNotFoundError();
            }
            return String(this.challenge.user_id);
        }
    }
    async deserializeCookieJar(cookies) {
    }
    async serializeCookieJar() {
    }
    async serialize() {
        const obj = {
            constants: this.constants,
            cookies: JSON.stringify(await this.serializeCookieJar()),
        };
        for (const [key, value] of Object.entries(this)) {
            obj[key] = value;
        }
        return obj;
    }
    async deserialize(state) {
        State.stateDebug(`Deserializing state of type ${typeof state}`);
        const obj = typeof state === 'string' ? JSON.parse(state) : state;
        if (typeof obj !== 'object') {
            State.stateDebug(`State deserialization failed, obj is of type ${typeof obj} (object expected)`);
            throw new TypeError("State isn't an object or serialized JSON");
        }
        State.stateDebug(`Deserializing ${Object.keys(obj).join(', ')}`);
        if (obj.constants) {
            this.constants = obj.constants;
            delete obj.constants;
        }
        if (obj.cookies) {
            await this.deserializeCookieJar(obj.cookies);
            delete obj.cookies;
        }
        for (const [key, value] of Object.entries(obj)) {
            this[key] = value;
        }
    }
    generateDevice(seed) {
        const chance = new chance_1.default(seed);
        this.deviceString = chance.pickone(devices);
        const id = chance.string({
            pool: 'abcdef0123456789',
            length: 16,
        });
        this.deviceId = `android-${id}`;
        this.uuid = chance.guid();
        this.phoneId = chance.guid();
        this.adid = chance.guid();
        this.build = chance.pickone(builds);
    }
    generateTemporaryGuid(seed, lifetime) {
        return new chance_1.default(`${seed}${this.deviceId}${Math.round(Date.now() / lifetime)}`).guid();
    }
    hasValidAuthorization() {
        return this.parsedAuthorization && this.parsedAuthorization[AUTHORIZATION_TAG] === this.authorization;
    }
    updateAuthorization() {
        var _a;
        if (!this.hasValidAuthorization()) {
            if ((_a = this.authorization) === null || _a === void 0 ? void 0 : _a.startsWith('Bearer IGT:2:')) {
                try {
                    this.parsedAuthorization = Object.assign(Object.assign({}, JSON.parse(Buffer.from(this.authorization.substring('Bearer IGT:2:'.length), 'base64').toString())), { [AUTHORIZATION_TAG]: this.authorization });
                }
                catch (e) {
                    State.stateDebug(`Could not parse authorization: ${e}`);
                    this.parsedAuthorization = undefined;
                }
            }
            else {
                this.parsedAuthorization = undefined;
            }
        }
    }
}
State.stateDebug = (0, debug_1.default)('ig:state');
__decorate([
    (0, decorators_1.Enumerable)(false),
    __metadata("design:type", Object)
], State.prototype, "constants", void 0);
__decorate([
    (0, decorators_1.Enumerable)(false),
    __metadata("design:type", String)
], State.prototype, "proxyUrl", void 0);
__decorate([
    (0, decorators_1.Enumerable)(false),
    __metadata("design:type", Object)
], State.prototype, "checkpoint", void 0);
__decorate([
    (0, decorators_1.Enumerable)(false),
    __metadata("design:type", Object)
], State.prototype, "challenge", void 0);
__decorate([
    (0, decorators_1.Enumerable)(false),
    __metadata("design:type", Object)
], State.prototype, "parsedAuthorization", void 0);
exports.State = State;
//# sourceMappingURL=state.js.map