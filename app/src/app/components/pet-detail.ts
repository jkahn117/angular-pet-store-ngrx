import {
  Component,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { Pet } from '../models/pet';

@Component({
  selector: 'pet-detail',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './templates/pet-detail.html'
})

export class PetDetailComponent {
  /**
   * Presentational components receieve data through @Input() and communicate events
   * through @Output() but generally maintain no internal state of their
   * own. All decisions are delegated to 'container', or 'smart'
   * components before data updates flow back down.
   *
   * More on 'smart' and 'presentational' components: https://gist.github.com/btroncone/a6e4347326749f938510#utilizing-container-components
   */
  @Input() pet:Pet;
  @Input() inStore:boolean;
  @Output() add = new EventEmitter<Pet>();
  //@Output() remove = new EventEmitter<Pet>();


  /**
   * Tip: Utilize getters to keep templates clean
   */
  get id() {
    return this.pet.id;
  }

  get name() {
    return this.pet.name;
  }

  get photourl() {
    return this.pet.photourl;
  }

  get status() {
    return this.pet.status;
  }

  get category() {
    return this.pet.category;
  }

  get age() {
    return this.pet.age;
  }
}

