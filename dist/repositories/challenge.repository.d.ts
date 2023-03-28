import { Repository } from '../core/repository';
import { ChallengeStateResponse } from '../responses';
export declare class ChallengeRepository extends Repository {
    state(): Promise<any>;
    selectVerifyMethod(choice: string, isReplay?: boolean): Promise<any>;
    replay(choice: string): Promise<any>;
    deltaLoginReview(choice: '1' | '0'): Promise<any>;
    sendPhoneNumber(phoneNumber: string): Promise<any>;
    auto(reset?: boolean): Promise<ChallengeStateResponse>;
    reset(): Promise<any>;
    sendSecurityCode(code: string | number): Promise<any>;
    sendSecurityCodeWithoutSign(code: string, cni: any): Promise<any>;
    sendSecurityCodeToPhoneConfirmation(code: string): Promise<any>;
    private middleware;
}
