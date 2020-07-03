import Redirect from 'umi/redirect';
import { sysDefultPage } from '@/config/platform.config'
//重定向到默认路由
export default () => <Redirect to={ sysDefultPage } />