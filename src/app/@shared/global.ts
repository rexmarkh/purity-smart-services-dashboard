import { NhostClient } from '@nhost/nhost-js'
import { environment } from '../../environments/environment.prod';

export const nhost = new NhostClient({
    // backendUrl: environment.backendUrl,
    subdomain: environment.subdomain,
    region: environment.region
});