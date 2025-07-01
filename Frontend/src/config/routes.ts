export const routes = {
  dashboard: "/dashboard",
  // invoice: {
  //   create: "/invoice/create",
  //   "manual-invoices": "/invoice/manual-invoices",
  //   quotations: "/invoice/quotations",
  //   edit: (orderId: string) => `/invoice/edit/${orderId}`,
  // },
  // skuLocation: {
  //   list: "/skuLocations",
  // },
  // skuHistory: "/sku-history",
  // productsDimensionImages: {
  //   list: "/product-dimenion-images",
  // },
  // lot: {
  //   list: "/lots",
  //   new: '/lots/new',
  //   sku: (lotId: string) => `/lots/${lotId}/sku`,
  //   newSku: (id: string) => `/lots/${id}/sku/new`,
  //   editSku: (lotId: string, skuId: string) => `/lots/${lotId}/sku/${skuId}/edit`
  // },
  // "price-attribution": "/price-attribution",
  // fileExplorer: {
  //   list: "/file-explorer",
  //   folder: (folderId: string) => `/file-explorer/${folderId}`,
  //   file: (fileId: string) => `/drive/${fileId}`,
  // },
  // order: {
  //   list: "/orders",
  //   ordersPreview: "/orders/preview",
  // },
  // productList: "/product-list",

  // inventory: "/inventory",
  // products: {
  //   "OkRef": `/products/OkRef`,
  //   createProduct: "/products/create",
  //   addShopifyProductForSku: (skuId: string) => `/products/OkRef/${skuId}`,
  //   editShopifyProduct: (productId: string) => `/products/edit/${productId}`,
  // },

  // profile: "/profile/edit-profile",
  // changePassword: "/profile/change-password",
  // refPriceHistory: "/ref-price-history",
  // role: {
  //   createRole: "/roles/create",
  //   list: "/roles",
  //   roleDetails: (slug: string) => `/roles/${slug}`,
  //   editRole: (slug: string) => `/roles/update/${slug}`,
  // },

  // consolidation: {
  //   list: "/consolidate",
  //   collectionProducts: (slug: string) => `/consolidate/${slug}`,
  // },
  // "hd-net-pricing": "/hd-net-pricing",
  // registeredUsers: {
  //   dashboard: '/',
  //   list: '/users',
  //   userDetails: (slug: string) => `/users/${slug}`,
  //   assignedFolders: (slug: string) => `/users/${slug}/assigned-folders`,
  //   assignedSku: (slug: string) => `/users/${slug}/skus`,
  //   addEmployee: '/users/employee/create',
  //   updateEmployee: (slug: string) => `users/employee/update/${slug}`,
  // },

  // batchScan: {
  //   scan: "/batch-scan",
  //   sessionHistory: "/session-history",
  // },

  blog:{
    list: "/blogs",
    create: "/blogs/create",
    orderDetails: (blogId: string) => `/blogs/${blogId}`,
    editOrder: (blogId: string) => `/blogs/${blogId}/update`,
  },

  auth:{
    login: "/auth/login",
    signup: "/auth/signup",
    forgotPassword: "/auth/forgot-password",
  },
  profile: "/profile/edit-profile",

};
