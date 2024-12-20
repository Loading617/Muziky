const frequencies = [60, 170, 350, 1000, 3500]; // Frequency bands in Hz
const equalizerProfiles = {
    Flat: [0, 0, 0, 0, 0],
    Pop: [2, 4, 0, 2, 1],
    Rock: [4, 2, -2, 2, 4],
    Jazz: [3, 1, 0, 3, 2],
    Classical: [3, 2, 0, 2, 3],
    Dance: [1, 1, 1, 1, 1],
    Party: [4, 2, -2, 2, 4],
    Soft: [0, 1, -1, 1, 0],
    Hard: [2, 2, -2, 2, 2],
    TrebleBoost: [4, 2, 0, -2, 4],
    MidBoost: [2, 4, 0, -2, 2],
    SubBass: [1, 1, 1, 1, 1],
    BassBoost: [5, 3, 0, -2, -4],
    TrebleCut: [-4, -2, 0, 2, 4],
    MidCut: [-2, -2, 0, 2, 2],
    SubBassCut: [-1, -1, -1, -1, -1],
    BassCut: [-5, -3, 0, -2, -4]
  };