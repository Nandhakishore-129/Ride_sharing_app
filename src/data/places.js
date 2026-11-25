export const places = [
  { name: 'Railway Station', x: 60, y: 300 },
  { name: 'Old Town', x: 150, y: 200 },
  { name: 'City Mall', x: 230, y: 260 },
  { name: 'University', x: 250, y: 110 },
  { name: 'Hospital', x: 340, y: 190 },
  { name: 'Tech Park', x: 450, y: 120 },
  { name: 'Stadium', x: 400, y: 300 },
  { name: 'Airport', x: 550, y: 60 },
  { name: 'Beach Road', x: 540, y: 320 },
]

export const KM_PER_PX = 0.035
export const placeByName = (name) => places.find((place) => place.name === name)
