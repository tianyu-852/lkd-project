import maps from 'qqmap'
console.log(maps)

export function TMap() {
  return new Promise(resolve => {
    maps.init('DWPBZ-3MAY3-NNM3R-3ZES7-5NEXZ-J6BNX', () => {
      resolve(maps)
    })
  })
}
