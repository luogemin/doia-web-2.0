export default {
  'GET /get/auth': {
    // status: "success",
    // msg: null,
    // code: 100000,
    data: [
      {
        code: "1011000101",
        selected: true,
      },
      {
        code: "11",
        selected: true,
      }
    ],
    iuser: {
      accountId: 110,
      id: 2,
      isAdmin: true,
      name: "Admin"
    },
    authResults: [
      {
        code: "overview",
        moduleCode: "101",
        name: "概览",
        type:1
      },
      {
        code: "businessManagement",
        moduleCode: "101",
        name: "业务管理",
        type:1
      }
    ]
  }
};
