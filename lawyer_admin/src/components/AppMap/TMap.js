import maps from 'qqmap'

export function TMap() {
    return new Promise(resolve => {
        maps.init('DWPBZ-3MAY3-NNM3R-3ZES7-5NEXZ-J6BNX', () => {
            console.log(maps)
            resolve(maps)
        })
    })
}
