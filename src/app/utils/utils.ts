import {Injectable} from '@angular/core';
import * as _ from 'lodash';
import {uuid} from './uuid';
import { USER_SESSION_KEY } from '../shared/constants';

@Injectable()
export class Utils {

  static uuid(): string {
    return uuid();
  }

  static deepCopy(obj: any): any {
    return _.clone(obj);
  }
}

export const SESSION_KEY: string = localStorage.getItem(USER_SESSION_KEY) || Utils.uuid();
