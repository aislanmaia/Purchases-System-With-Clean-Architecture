import {LocalSavePurchases} from "@/data/usecases";
import {CacheStore} from "@/data/protocols/cache/cache-store";

class CacheStoreSpy implements CacheStore {
  deleteCallsCount = 0
  insertCallsCount = 0
  deleteKey: string
  insertKey: string;

  delete(key: string): void {
    this.deleteCallsCount++
    this.deleteKey = key
  }

  insert(key: string): void {
    this.insertCallsCount++
    this.insertKey = key
  }


}

type SutTypes = {
  sut: LocalSavePurchases
  cacheStore: CacheStoreSpy
}

const makeSut = (): SutTypes => {
  const cacheStore = new CacheStoreSpy()
  const sut = new LocalSavePurchases(cacheStore);
  return {
    cacheStore,
    sut
  }
}

describe('LocalSavePurchases', () => {
  test('should not delete cache on init', () => {
    const {cacheStore} = makeSut()
    new LocalSavePurchases(cacheStore);
    expect(cacheStore.deleteCallsCount).toBe(0)
  })
  test('should delete old cache on save', async () => {
    const {cacheStore, sut} = makeSut()
    await sut.save()
    expect(cacheStore.deleteCallsCount).toBe(1)
    expect(cacheStore.deleteKey).toBe('purchases')
  })
  test('should not insert new Cache if delete fails', () => {
    const {cacheStore, sut} = makeSut()
    jest.spyOn(cacheStore, 'delete').mockImplementationOnce(() => { throw new Error() })
    const promise = sut.save()
    expect(cacheStore.insertCallsCount).toBe(0)
    expect(promise).rejects.toThrow()
  })
  test('should insert new Cache if delete succeeds', async () => {
    const {cacheStore, sut} = makeSut()
    await sut.save()
    expect(cacheStore.deleteCallsCount).toBe(1)
    expect(cacheStore.insertCallsCount).toBe(1)
    expect(cacheStore.deleteKey).toBe('purchases')
    expect(cacheStore.insertKey).toBe('purchases')
  })
})