// src/api/userApi.ts
export const userApi = {
  list: async () => {
    return [
      { id: 1, name: 'Alice', email: 'alice@test.com' },
      { id: 2, name: 'Bob', email: 'bob@test.com' },
    ];
  },
  create: async (user: any) => {
    console.log('create user', user);
    return user;
  },
  remove: async (id: number) => {
    console.log('remove user', id);
  }
};
