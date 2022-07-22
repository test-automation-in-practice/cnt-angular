import {Type} from "@angular/core";

export interface NavbarEntry {
  displayName: string;
  buildRouterLink: () => string;
}

export class DefinedRoute implements NavbarEntry {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(public path: string, public component: Type<any>, public displayName: string) {}

  buildRouterLink() {
    return '/' + this.path.replace('**', '');
  }
}
