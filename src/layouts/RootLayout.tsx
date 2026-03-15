import { Outlet, Link } from 'react-router-dom';

const RootLayout = () => {
    return (
        <div className="root-layout">
            <nav className="flex items-center justify-between p-4">
                <Link to="/" className="flex items-center gap-2">
                    <img src="/logo.svg" alt="Logo" width={38} height={32} />
                    <h2 className="text-primary-100">PrepWise</h2>
                </Link>
                {/* LogoutButton will be added on Day 2 */}
            </nav>
            <Outlet />
        </div>
    );
};

export default RootLayout;
