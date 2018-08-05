import { HttpHeaders } from "../../../node_modules/@angular/common/http";
import { ConfigService } from "../services/configService";

export class BaseRepository {
    protected getHttpOptions() {
        return {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + ConfigService.token
            })
        }
    }
}