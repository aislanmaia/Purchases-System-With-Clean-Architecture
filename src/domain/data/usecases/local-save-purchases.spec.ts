class LocalSavePurchases {
  constructor(private readonly cacheStore: CacheStore) {
  }

  async save(): Promise<void> {
    this.cacheStore.delete()
  }
}

interface CacheStore {
  delete: () => void
}

class CacheStoreSpy implements CacheStore{
  deleteCallsCount = 0

  delete(): void {
    this.deleteCallsCount++
  }
}

describe('LocalSavePurchases', () => {
  test('should not delete cache on init', () => {
    const cacheStore = new CacheStoreSpy()
    new LocalSavePurchases(cacheStore);
    expect(cacheStore.deleteCallsCount).toBe(0)
  })
  test('should delete old cache on save', () => {
    const cacheStore = new CacheStoreSpy()
    let localSavePurchases = new LocalSavePurchases(cacheStore);
    localSavePurchases.save()
    expect(cacheStore.deleteCallsCount).toBe(1)
  })
})