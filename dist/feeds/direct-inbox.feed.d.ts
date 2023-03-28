import { Feed } from '../core/feed';
import { DirectInboxFeedResponse, DirectInboxFeedResponseThreadsItem } from '../responses';
import { DirectThreadEntity } from '../entities';
export declare class DirectInboxFeed extends Feed<DirectInboxFeedResponse, DirectInboxFeedResponseThreadsItem> {
    private cursor;
    private seqId;
    set state(body: DirectInboxFeedResponse);
    request(): Promise<any>;
    items(): Promise<any>;
    records(): Promise<DirectThreadEntity[]>;
}
