import { lastValueFrom, Observable, take } from 'rxjs';

// TODO extract me into a lib
export function toPromise<S>(obs: Observable<S>): Promise<S> {
  return lastValueFrom(obs.pipe(take(1)));
}
