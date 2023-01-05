import LoginLayout from './login';
import PlatformLayout from './platform';
import ScreenLayout from './screen';
import { getToken } from "@/utils/auth";
import { sysDefultPage } from '@/config/platform.config'

function Index(props) {
    const { children, location } = props;
    const { pathname } = location;
    if (pathname === '/login' || /^\/login/.test(pathname) || !getToken()) {
        return <LoginLayout>{children}</LoginLayout>;
    } else if (pathname === sysDefultPage.pathname) {
        return <ScreenLayout>{children}</ScreenLayout>
    }
    return <PlatformLayout {...props}>{children}</PlatformLayout>;
}

export default Index;
