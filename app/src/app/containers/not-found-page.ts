import { Component, ChangeDetectionStrategy } from '@angular/core';


@Component({
  selector: 'not-found-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1 class="page-header">404: Not Found</h1>

    <p>
      We could not find this page.
    </p>
    <p>
      <button class="btn-lg btn-primary" routerLink="/">Take Me Home</button>
    </p>
  `,
  styles: [`
    :host {
      text-align: center;
    }
  `]
})
export class NotFoundPageComponent { }

