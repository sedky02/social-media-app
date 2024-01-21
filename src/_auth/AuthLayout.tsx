import { Outlet, Navigate, useLocation } from "react-router-dom";
function AuthLayout() {
  const isAuthenticated = false;
  const location = useLocation();
  return (
    <>
      {isAuthenticated ? (
        <Navigate to="/" />
      ) : (
        <>
          <section className={`flex-center  flex-1 min-h-screen h-fit ${location.pathname == "/sign-up" && "py-3" }  `}>
            <Outlet />
          </section>
          <img
            src="/assets/images/side-img.svg"
            alt="side screen image"
            className={` hidden lg:block min-h-screen ${location.pathname == "/sign-up" && "h" }   w-1/2 object-cover bg-no-repeat ` } 
          />
        </>
      )}
    </>
  );
}

export default AuthLayout;
