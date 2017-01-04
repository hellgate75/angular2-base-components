export interface Cloneable {
  id: string;
  clone(): Cloneable;
}

export interface Reversible {
  reverse(object: any): void;
}

export class ItemChange {
  key: string;
  value: any;
}

export interface ICloneableConstructor<T extends Cloneable> {
  new(object: any): T;
}

export class CloneableCreator<T extends Cloneable> {
  constructor(private newInstance: ICloneableConstructor<T>) {
  }
  getNewInstance(object: any): T {
    return new this.newInstance(object);
  }
}

export class Factory {

  static newCloneable<T extends Cloneable>(object: any, creator: CloneableCreator<T>): T {
    return creator.getNewInstance(object);
  }
}
