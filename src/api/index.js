export {default as login} from './acl/login' // {default: {}}
export {default as user} from './acl/user'
export {default as role} from './acl/role'
export {default as permission} from './acl/permission'
export {default as category} from './category'
export {default as clientUser} from './clientUser'
export {default as order} from './order'
export {default as trademark} from './product/trademark'
export {default as spu} from './product/spu'
// 1. 引入默认暴露的内容重命名为attr
// 2. 将attr给分别暴露出去
export {default as attr} from './product/attr'
// import { default as attr } from './order' // 完整引入
// import order from './attr' // 完整引入的简写