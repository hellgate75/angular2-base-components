export interface Cloneable {
  clone(): Cloneable;
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
