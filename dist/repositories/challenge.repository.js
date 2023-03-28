"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChallengeRepository = void 0;
const repository_1 = require("../core/repository");
const errors_1 = require("../errors");
class ChallengeRepository extends repository_1.Repository {
    async state() {
        const { body } = await this.client.request.send({
            url: this.client.state.challengeUrl,
            qs: {
                guid: this.client.state.uuid,
                device_id: this.client.state.deviceId,
            },
        });
        this.middleware(body);
        return body;
    }
    async selectVerifyMethod(choice, isReplay = false) {
        let url = this.client.state.challengeUrl;
        if (isReplay) {
            url = url.replace('/challenge/', '/challenge/replay/');
        }
        const { body } = await this.client.request.send({
            url,
            method: 'POST',
            form: this.client.request.sign({
                choice,
                _csrftoken: this.client.state.cookieCsrfToken,
                guid: this.client.state.uuid,
                device_id: this.client.state.deviceId,
            }),
        });
        this.middleware(body);
        return body;
    }
    replay(choice) {
        return this.selectVerifyMethod(choice, true);
    }
    async deltaLoginReview(choice) {
        return await this.selectVerifyMethod(choice);
    }
    async sendPhoneNumber(phoneNumber) {
        const { body } = await this.client.request.send({
            url: this.client.state.challengeUrl,
            method: 'POST',
            form: this.client.request.sign({
                phone_number: String(phoneNumber),
                _csrftoken: this.client.state.cookieCsrfToken,
                guid: this.client.state.uuid,
                device_id: this.client.state.deviceId,
            }),
        });
        this.middleware(body);
        return body;
    }
    async auto(reset = false) {
        if (!this.client.state.checkpoint) {
            throw new errors_1.IgNoCheckpointError();
        }
        if (reset) {
            await this.reset();
        }
        if (!this.client.state.challenge) {
            await this.state();
        }
        const challenge = this.client.state.challenge;
        switch (challenge.step_name) {
            case 'select_verify_method': {
                return await this.selectVerifyMethod(challenge.step_data.choice);
            }
            case 'delta_login_review': {
                return await this.deltaLoginReview('0');
            }
            default: {
                return challenge;
            }
        }
    }
    async reset() {
        const { body } = await this.client.request.send({
            url: this.client.state.challengeUrl.replace('/challenge/', '/challenge/reset/'),
            method: 'POST',
            form: this.client.request.sign({
                _csrftoken: this.client.state.cookieCsrfToken,
                guid: this.client.state.uuid,
                device_id: this.client.state.deviceId,
            }),
        });
        this.middleware(body);
        return body;
    }
    async sendSecurityCode(code) {
        const { body } = await this.client.request
            .send({
            url: this.client.state.challengeUrl,
            method: 'POST',
            form: this.client.request.sign({
                security_code: code,
                _csrftoken: this.client.state.cookieCsrfToken,
                guid: this.client.state.uuid,
                device_id: this.client.state.deviceId,
            }),
        })
            .catch((error) => {
            if (error.response.statusCode === 400 && error.response.body.status === 'fail') {
                throw new errors_1.IgChallengeWrongCodeError(error.response.body.message);
            }
            throw error;
        });
        this.middleware(body);
        return body;
    }
    async sendSecurityCodeWithoutSign(code, cni) {
        const { body } = await this.client.request
            .send({
            url: '/api/v1/bloks/apps/com.instagram.challenge.navigation.take_challenge/',
            method: 'POST',
            form: {
                should_promote_account_status: 0,
                security_code: code,
                _csrftoken: this.client.state.cookieCsrfToken,
                _uuid: this.client.state.uuid,
                device_id: this.client.state.deviceId,
                bk_client_context: {
                    bloks_version: '4c472e31d5cc317652d7a0e6294dd2f50923e0d90c804420ee5940fcb30e180c',
                    styles_id: 'instagram',
                },
                challenge_context: {
                    step_name: 'submit_phone',
                    cni: cni,
                    is_stateless: false,
                    challenge_type_enum: 'UNKNOWN',
                    present_as_modal: false,
                },
                bloks_versioning_id: '4c472e31d5cc317652d7a0e6294dd2f50923e0d90c804420ee5940fcb30e180c',
            },
        })
            .catch((error) => {
            if (error.response.statusCode === 400 && error.response.body.status === 'fail') {
                throw new errors_1.IgChallengeWrongCodeError(error.response.body.message);
            }
            throw error;
        });
        this.middleware(body);
        return body;
    }
    async sendSecurityCodeToPhoneConfirmation(code) {
        let formData = this.client.request.sign({
            should_promote_account_status: 0,
            security_code: code,
            _uuid: this.client.state.uuid,
            bk_client_context: {
                bloks_version: '4c472e31d5cc317652d7a0e6294dd2f50923e0d90c804420ee5940fcb30e180c',
                styles_id: 'instagram',
            },
            challenge_context: {
                step_name: 'submit_phone',
                cni: 17910836552614637,
                is_stateless: false,
                challenge_type_enum: 'UNKNOWN',
                present_as_modal: false,
            },
            bloks_versioning_id: '4c472e31d5cc317652d7a0e6294dd2f50923e0d90c804420ee5940fcb30e180c',
        });
        const { body } = await this.client.request
            .send({
            url: '/api/v1/bloks/apps/com.instagram.challenge.navigation.take_challenge/',
            method: 'POST',
            form: formData,
        })
            .catch((error) => {
            if (error.response.statusCode === 400 && error.response.body.status === 'fail') {
                throw new errors_1.IgChallengeWrongCodeError(error.response.body.message);
            }
            throw error;
        });
        this.middleware(body);
        return body;
    }
    middleware(body) {
        if (body.action === 'close') {
            this.client.state.checkpoint = null;
            this.client.state.challenge = null;
        }
        else {
            this.client.state.challenge = body;
        }
    }
}
exports.ChallengeRepository = ChallengeRepository;
//# sourceMappingURL=challenge.repository.js.map