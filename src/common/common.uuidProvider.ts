import {v4 as Id} from 'uuid';

export class uuidProvider {
    public getUuid():string{
        return Id();
    }
}
