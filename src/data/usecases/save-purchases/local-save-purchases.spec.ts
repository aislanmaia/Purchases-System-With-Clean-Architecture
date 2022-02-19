import {LocalSavePurchases} from "@/data/usecases";
import {CacheStore} from "@/data/protocols/cache/cache-store";

class CacheStoreSpy implements CacheStore {
  deleteCallsCount = 0
  key: string

  delete(key: string): void {
    this.deleteCallsCount++
    this.key = key
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
  test('should delete old cache on save', () => {
    const {cacheStore, sut} = makeSut()
    sut.save()
    expect(cacheStore.deleteCallsCount).toBe(1)
    expect(cacheStore.key).toBe('purchases')
  })
})