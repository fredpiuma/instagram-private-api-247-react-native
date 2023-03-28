import { Entity } from '../core/entity';
export declare class ProfileEntity extends Entity {
    pk: string | number;
    checkFollow(): Promise<any>;
    checkUnfollow(): Promise<any>;
}
