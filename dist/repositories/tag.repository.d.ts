import { Repository } from '../core/repository';
export declare class TagRepository extends Repository {
    search(q: string): Promise<any>;
    section(q: string, tab: string): Promise<any>;
}
