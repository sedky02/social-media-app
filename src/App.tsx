import { Routes, Route } from "react-router-dom";
import { SigninForm, SignupForm } from "./_auth/forms";
import { Home } from "./_root/pages";
import { Toaster } from "./components/ui/toaster";
import "./globals.css";
import AuthLayout from "./_auth/AuthLayout";
import RootLayout from "./_root/RootLayout";

function App() {
  return (
    <main className="flex h-screen">
      <Routes>
        {/* public Routes => not signed ppl */}
        <Route element={<AuthLayout />}>
          <Route path="/sign-in" element={<SigninForm />} />
          <Route path="/sign-up" element={<SignupForm />} />
        </Route>

        {/* private Routes => logged in ppl */}
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
        </Route>
      </Routes>
      <Toaster/>
    </main>
  );
}

export default App;
