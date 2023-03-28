"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaEntity = void 0;
const axios_1 = __importDefault(require("axios"));
const entity_1 = require("../core/entity");
class MediaEntity extends entity_1.Entity {
    static async oembed(url) {
        const response = await axios_1.default.get('https://api.instagram.com/instagram_oembed/', {
            params: {
                url,
            },
        });
        return response.data;
    }
}
exports.MediaEntity = MediaEntity;
//# sourceMappingURL=media.entity.js.map