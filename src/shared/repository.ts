export interface Repository<T> {
  findAll(): Promise<T[]>;
  findOne(item: { id: number }): Promise<T | undefined>;
  add(item: T): Promise<T | undefined>;
  update(item: T): Promise<T | undefined>;
  delete(item: { id: number }): Promise<T | undefined>;
}