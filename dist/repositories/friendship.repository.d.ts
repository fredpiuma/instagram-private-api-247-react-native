import { Repository } from '../core/repository';
import { FriendshipRepositoryChangeResponseRootObject } from '../responses';
import { SetBestiesInput } from '../types';
export declare class FriendshipRepository extends Repository {
    show(id: string | number): Promise<any>;
    showMany(userIds: string[] | number[]): Promise<any>;
    block(id: string | number, mediaIdAttribution?: string): Promise<any>;
    unblock(id: string | number, mediaIdAttribution?: string): Promise<any>;
    create(id: string | number, mediaIdAttribution?: string): Promise<any>;
    destroy(id: string | number, mediaIdAttribution?: string): Promise<any>;
    approve(id: string | number, mediaIdAttribution?: string): Promise<any>;
    deny(id: string | number, mediaIdAttribution?: string): Promise<any>;
    removeFollower(id: string | number): Promise<any>;
    private change;
    setBesties(input?: SetBestiesInput): Promise<any>;
    mutePostsOrStoryFromFollow(options: {
        mediaId?: string;
        targetReelAuthorId?: string;
        targetPostsAuthorId?: string;
    }): Promise<FriendshipRepositoryChangeResponseRootObject>;
    unmutePostsOrStoryFromFollow(options: {
        targetReelAuthorId?: string;
        targetPostsAuthorId?: string;
    }): Promise<FriendshipRepositoryChangeResponseRootObject>;
    private changeMuteFromFollow;
}
