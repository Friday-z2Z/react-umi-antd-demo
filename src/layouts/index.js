import LoginLayout from './login';
import PlatformLayout from './platform';
import { getToken } from "@/utils/auth";

function Index(props) {
    const { children, location } = props;
    const { pathname } = location;
    if (pathname === '/login' || /^\/login/.test(pathname) || !getToken()) {
        return <LoginLayout>{children}</LoginLayout>;
    }
    return <PlatformLayout {...props}>{children}</PlatformLayout>;
}

export default Index;
