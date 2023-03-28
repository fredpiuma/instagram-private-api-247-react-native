import { Repository } from '../core/repository';
import { FbsearchRepositoryTopsearchFlatResponseRootObject } from '../responses';
export declare class FbsearchRepository extends Repository {
    suggestedSearches(type: 'blended' | 'users' | 'hashtags' | 'places'): Promise<any>;
    recentSearches(): Promise<any>;
    topsearchFlat(query: string): Promise<FbsearchRepositoryTopsearchFlatResponseRootObject>;
    places(query: string): Promise<any>;
}
