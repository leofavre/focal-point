export const DBConfig = {
  name: "FocalPointDB",
  version: 1,
  objectStoresMeta: [
    {
      store: "ui",
      storeConfig: {
        keyPath: "id",
        autoIncrement: true,
      },
      storeSchema: [
        {
          name: "value",
          keypath: "value",
          options: { unique: false },
        },
      ],
    },
    {
      store: "images",
      storeConfig: {
        keyPath: "id",
        autoIncrement: false,
      },
      storeSchema: [
        {
          name: "createdAt",
          keypath: "createdAt",
          options: { unique: false },
        },
      ],
    },
  ],
};
