module.exports = {
  getRooms() {
    return [
      {
        id: 1,
        name: 'Gallery',
        image: require('../img/galerija.jpg'),
        capacity: 10
      },
      {
        id: 2,
        name: 'Small room',
        image: require('../img/malasala.jpg'),
        capacity: 4
      },
      {
        id: 3,
        name: 'Sunny room',
        image: require('../img/suncanasala.jpg'),
        capacity: 4
      },
      {
        id: 4,
        name: 'Big room',
        image: require('../img/velikasala.jpg'),
        capacity: 4
      },
      {
        id: 5,
        name: 'Bar',
        image: require('../img/bar.jpg'),
        capacity: 4
      }
    ]
  }
}
