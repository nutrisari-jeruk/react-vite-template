import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryProvider } from "./lib/QueryProvider";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ErrorTest from "./pages/ErrorTest";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <QueryProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="error-test" element={<ErrorTest />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryProvider>
  );
}

export default App;
