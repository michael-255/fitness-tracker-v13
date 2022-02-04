import { Measurement, Exercise, Workout } from '../models/Entities.js'

/**
 * Using pre-generated ids so new default measurements, exercises, and workouts
 * can be added without breaking any record data that users may already have in
 * the app.
 */
const DEFAULT_IDS = Object.freeze({
  measurements: [
    '14e09d78-94d6-40b8-876d-0804e9c457f5',
    'd2e44ba5-4ba6-49fd-a411-da0abbef2483',
    '32f526b5-856f-42fa-9772-2650302e197d',
    'c61e5e53-b03d-4342-abf8-b94006b315ec',
    '47baa309-f303-469d-8440-2ee7c5f3b14b',
    'ae3d5dda-ace9-41c2-8cd6-22a4390a1cc0',
    'a45100d3-c36c-4830-80af-6c0ad01b4bf1',
    'b61dfc60-ce56-4cc1-812f-3baa684b5f1d',
    '399a7969-0e59-4f2b-94d5-2aedc58e5c19',
    '95bbc756-04b3-4091-a404-d01f3c81daea',
    'f25a52c8-1a77-4933-b38b-56ba39cee933',
    '18470793-081a-4771-9e8e-6f7d6035aa24',
    'cfd5e054-8234-4149-89c2-533083148fde',
    '6fd59aae-cf63-4ae0-98b9-faf28638a2a6',
    '7cff9c4b-2dcf-42be-a083-86c18120dc24',
    // Add new measurement ids here...
  ],
  exercises: [
    '4df4eed2-91ad-4134-a700-2240429e55ab',
    'b1d92c34-4c25-48af-8f8f-e3f0976f6798',
    '09a87928-47dc-4916-803d-53fcef3ea4ca',
    'ff7fee40-5117-4ba7-bdf8-952d58bcdf5f',
    '0442cd9e-c02e-4a84-896b-016e80a2fd96',
    'ae0221d2-251a-4814-a162-811c98a6f8e5',
    'e9fa4a3d-6396-490b-a7cd-bc9d076c6181',
    '5702d00a-302e-4cd8-a6db-b7da718122a6',
    '6d5bbec1-96eb-4f8a-a779-e0d6a6a20c92',
    'a895dead-1b65-45db-b7df-2849e696f1bf',
    '7f736e80-c8c8-4537-8915-e90f400ffd1c',
    'd9b351bc-1e93-4847-93b7-13534654a319',
    '83bd2972-fdcf-4ae4-be90-3d817543cf7c',
    'dd3ff022-c68e-46a4-95d9-b5fc860a73a6',
    'f6e599ec-1aed-4cd8-88ab-37aee5674d9f',
    '7c3ad271-6232-4078-825a-1943401d53b7',
    '22da24f8-4e72-4a95-875a-6239c1b6f40f',
    '5111ef0f-80c6-4b1b-bd8f-4bf81a76f3f5',
    '6fa54948-fab2-4309-9f89-713ae87b4720',
    '1f1372a9-967b-4a64-9ac9-253ee182a5ae',
    'ff3856c2-c9e7-4ea2-afd6-e039c727317f',
    'ff8287d6-edd9-40f2-8206-0a1282013537',
    '5ade7471-b10e-4824-9518-d6ae03bb803c',
    'ee22935d-cbd0-493e-a968-eea68c940313',
    'da7eb169-53a4-4c52-9647-af6adb075e75',
    '753874ab-ed4d-4c89-b124-35a18cebe645',
    'ec3b5f4e-9ea3-4662-a19d-a9f31d4638ec',
    'b3230e1b-95cb-4b27-b72b-cc5360bb16e6',
    '9b0f95b4-95e8-4133-bda3-043e9d245e60',
    'a730b80a-b60a-4815-b667-d7d7624c935a',
    '69ed871d-6d0e-49e6-a782-9e783236e223',
    '82a2d596-f78d-4a59-b617-82ef46db6ecf',
    '90215cff-7691-48b4-9b02-1351a71082ec',
    '21cf0e82-0ab4-45ed-9109-09969c1b3220',
    'dd80740f-1745-4434-8935-120a4b0ee53e',
    'eb61395a-d2c9-4efc-a4dc-33f4aa44a3a4',
    '7fd4d161-3e9d-4198-b417-2a65c6088321',
    '7a4352a1-3db2-43b2-8358-6813fa438c64',
    '9f701487-4e4d-4382-99ac-a143ba22b509',
    '0e2fe56f-973f-43ac-8007-d12d0554d631',
    // Add new exercise ids here...
  ],
  workouts: [
    '8d4e4291-b87b-4756-b4ed-7cdd153f413a',
    'afec8a78-03b2-4177-a5f4-e737c51966fd',
    '114d9f66-ad1f-4255-8b42-fd108dbc8cc2',
    '0d01d9cc-9c98-4fd5-b6ba-01e9758acd83',
    'f9c47e64-c70e-4a15-a91c-5ec027ccf445',
    'c55d2ae0-5210-43f8-818f-9361f4d78168',
    '8585a842-4b76-4e1a-8a58-9ff0acf72e4f',
    'b2a908ba-e5df-4099-b8d1-0dcdb976ad24',
    'a2ffbe9e-94b2-44fe-a1e9-f6abdb95d755',
    '5b1e933a-efd9-484c-91f0-a0f63b3efd41',
    '1286c1c3-1f96-45a8-880b-42cce2721eca',
    'a28cce81-f4aa-4186-9fcc-80e3b9de0a36',
    '8f31e58b-cdee-4fcd-b625-671a50ace3fb',
    'ab19f9db-de13-4660-87ff-da2b31a61003',
    'c54238ff-bd1b-4f7a-96f3-b9a54d00a9da',
    '206e2459-8538-4509-84cb-c837723a1439',
    // Add new workout ids here...
  ],
})

const Defaults = {
  /**
   * Returns default measurement options with constant ids.
   * Only add new options below current ones to ensure ids are not changed.
   */
  getMeasurements() {
    return [
      new Measurement({
        id: DEFAULT_IDS.measurements[0],
        name: 'Body Weight',
      }),
      new Measurement({
        id: DEFAULT_IDS.measurements[1],
        name: 'Body Fat',
      }),
      new Measurement({
        id: DEFAULT_IDS.measurements[2],
        name: 'Neck',
      }),
      new Measurement({
        id: DEFAULT_IDS.measurements[3],
        name: 'Shoulders',
      }),
      new Measurement({
        id: DEFAULT_IDS.measurements[4],
        name: 'Chest',
      }),
      new Measurement({
        id: DEFAULT_IDS.measurements[5],
        name: 'Left Biceps',
      }),
      new Measurement({
        id: DEFAULT_IDS.measurements[6],
        name: 'Right Biceps',
      }),
      new Measurement({
        id: DEFAULT_IDS.measurements[7],
        name: 'Left Forearms',
      }),
      new Measurement({
        id: DEFAULT_IDS.measurements[8],
        name: 'Right Forearms',
      }),
      new Measurement({
        id: DEFAULT_IDS.measurements[9],
        name: 'Waist',
      }),
      new Measurement({
        id: DEFAULT_IDS.measurements[10],
        name: 'Left Thighs',
      }),
      new Measurement({
        id: DEFAULT_IDS.measurements[11],
        name: 'Right Thighs',
      }),
      new Measurement({
        id: DEFAULT_IDS.measurements[12],
        name: 'Left Calves',
      }),
      new Measurement({
        id: DEFAULT_IDS.measurements[13],
        name: 'Right Calves',
      }),
      // Add new Measurements here...
    ]
  },

  /**
   * Returns default exercise options with constant ids.
   * Only add new options below current ones to ensure ids are not changed.
   */
  getExercises() {
    return [
      new Exercise({
        id: DEFAULT_IDS.exercises[0],
        name: 'Barbell Squats',
        inputs: { setCount: 5 },
      }),
      new Exercise({
        id: DEFAULT_IDS.exercises[1],
        name: 'Barbell Bench Press',
        inputs: { setCount: 5 },
      }),
      new Exercise({
        id: DEFAULT_IDS.exercises[2],
        name: 'Barbell Rows',
        inputs: { setCount: 5 },
      }),
      new Exercise({
        id: DEFAULT_IDS.exercises[3],
        name: 'Barbell Overhead Press',
        inputs: { setCount: 5 },
      }),
      new Exercise({
        id: DEFAULT_IDS.exercises[4],
        name: 'Deadlift',
        inputs: { setCount: 1 },
      }),
      // Add new Exercises here...
    ]
  },

  /**
   * Returns default workouts with constant ids (requires default exercises).
   * Only add new options below current ones to ensure ids are not changed.
   */
  getWorkouts() {
    const defaultExercises = this.getExercises()

    const getExerciseIdByName = (name) => {
      return defaultExercises.find((de) => de.name === name).id
    }

    return [
      new Workout({
        id: DEFAULT_IDS.workouts[0],
        name: 'StrongLifts 5x5 - Alpha',
        exerciseIds: [
          getExerciseIdByName('Barbell Squats'),
          getExerciseIdByName('Barbell Bench Press'),
          getExerciseIdByName('Barbell Rows'),
        ],
      }),
      new Workout({
        id: DEFAULT_IDS.workouts[1],
        name: 'StrongLifts 5x5 - Beta',
        exerciseIds: [
          getExerciseIdByName('Barbell Squats'),
          getExerciseIdByName('Barbell Overhead Press'),
          getExerciseIdByName('Deadlift'),
        ],
      }),
      // Add new Workouts here...
    ]
  },
}

export default Defaults
